package url

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

func analyzeURL(u *URL) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, u.URL, nil)
	if err != nil {
		return err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return errors.New("request timed out")
		}
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		u.PageTitle = http.StatusText(resp.StatusCode)
		return nil
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return err
	}

	u.PageTitle = doc.Find("title").Text()

	u.HTMLVersion = "HTML5"
	if doc.Find("!DOCTYPE html").Length() == 0 {
		u.HTMLVersion = "HTML4"
	}

	u.H1Count = doc.Find("h1").Length()
	u.H2Count = doc.Find("h2").Length()
	u.H3Count = doc.Find("h3").Length()
	u.H4Count = doc.Find("h4").Length()
	u.H5Count = doc.Find("h5").Length()
	u.H6Count = doc.Find("h6").Length()

	u.HasLoginForm = false
	doc.Find("form").Each(func(i int, s *goquery.Selection) {
		if s.Find("input[type='password']").Length() > 0 {
			u.HasLoginForm = true
		}
	})

	internal, external := 0, 0
	var brokenLinks []BrokenLink
	baseDomain := getDomain(u.URL)
	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		href, _ := s.Attr("href")
		if href == "" || strings.HasPrefix(href, "#") {
			return
		}
		link := resolveURL(u.URL, href)
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
			brokenLinks = append(brokenLinks, BrokenLink{
				URL:    link,
				Status: http.StatusText(status),
			})
		}
	})
	brokenLinksJSON, err := json.Marshal(brokenLinks)
	if err != nil {
		return err
	}
	u.BrokenLinksList = brokenLinksJSON
	u.InternalLinksCount = internal
	u.ExternalLinksCount = external
	u.BrokenLinksCount = len(brokenLinks)

	if ctx.Err() == context.DeadlineExceeded {
		return errors.New("request timed out")
	}

	return nil
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
