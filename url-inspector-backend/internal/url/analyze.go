package url

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

func analyzeURL(u *URL, repo URLRepository) error {
	tmp := *u

	parsed, err := url.ParseRequestURI(tmp.URL)
	if err != nil || parsed.Scheme == "" || parsed.Host == "" {
		return errors.New("invalid URL")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, tmp.URL, nil)
	if err != nil {
		return errors.New("invalid URL")
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return errors.New("analysis timed out")
		}
		return errors.New("unreachable URL")
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		tmp.PageTitle = http.StatusText(resp.StatusCode)
		return errors.New("bad HTTP status")
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	tmp.HTMLVersion = getHTMLVersion(bytes.NewReader(bodyBytes))
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader(bodyBytes))
	if err != nil {
		return err
	}
	tmp.PageTitle = doc.Find("title").Text()

	tmp.H1Count = doc.Find("h1").Length()
	tmp.H2Count = doc.Find("h2").Length()
	tmp.H3Count = doc.Find("h3").Length()
	tmp.H4Count = doc.Find("h4").Length()
	tmp.H5Count = doc.Find("h5").Length()
	tmp.H6Count = doc.Find("h6").Length()

	tmp.HasLoginForm = false
	doc.Find("form").Each(func(i int, s *goquery.Selection) {
		if s.Find("input[type='password']").Length() > 0 {
			tmp.HasLoginForm = true
		}
	})

	internal, external := 0, 0
	var brokenLinks []BrokenLink
	baseDomain := getDomain(tmp.URL)
	stopped := false

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		latest, err := repo.GetURLByID(tmp.ID)
		if err == nil && latest.Status == StatusStopped {
			stopped = true
			return
		}

		href, _ := s.Attr("href")
		if href == "" || strings.HasPrefix(href, "#") {
			return
		}
		link := resolveURL(tmp.URL, href)
		if strings.HasPrefix(link, "mailto:") {
			brokenLinks = append(brokenLinks, BrokenLink{
				URL:    link,
				Status: "unsupported",
			})
			return
		}
		if getDomain(link) == baseDomain {
			internal++
		} else {
			external++
		}
		status, err := checkLinkWithContext(ctx, link)
		if err != nil || status >= 400 {
			statusText := http.StatusText(status)
			if statusText == "" {
				statusText = "Unknown"
			}
			brokenLinks = append(brokenLinks, BrokenLink{
				URL:    link,
				Status: statusText,
			})
		}
	})

	if stopped {
		return errors.New("analysis stopped by user")
	}

	brokenLinksJSON, err := json.Marshal(brokenLinks)
	if err != nil {
		return err
	}
	tmp.BrokenLinksList = brokenLinksJSON
	tmp.InternalLinksCount = internal
	tmp.ExternalLinksCount = external
	tmp.BrokenLinksCount = len(brokenLinks)

	if ctx.Err() == context.DeadlineExceeded {
		return errors.New("analysis timed out")
	}
	*u = tmp
	return nil
}

func getHTMLVersion(r io.Reader) string {
	scanner := bufio.NewScanner(r)
	for i := 0; i < 5 && scanner.Scan(); i++ {
		line := strings.ToLower(scanner.Text())
		if strings.Contains(line, "<!doctype html>") {
			return "HTML5"
		}
		if strings.Contains(line, "<!doctype html public") {
			return "HTML4"
		}
		if strings.Contains(line, "<!doctype") {
			return "Other"
		}
	}
	return "Unknown"
}

func checkLinkWithContext(ctx context.Context, url string) (int, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodHead, url, nil)
	if err != nil {
		return 0, err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	return resp.StatusCode, nil
}

func getDomain(rawurl string) string {
	u, err := url.Parse(rawurl)
	if err != nil {
		return ""
	}
	return u.Host
}

func resolveURL(base, ref string) string {
	u, err := url.Parse(base)
	if err != nil {
		return ref
	}
	refURL, err := url.Parse(ref)
	if err == nil && refURL.IsAbs() {
		return ref
	}
	return u.Scheme + "://" + u.Host + ref
}
