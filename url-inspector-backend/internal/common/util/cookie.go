package util

import (
	"errors"
	"net/http"
)

func SetCookie(w http.ResponseWriter, value string, isTemp bool) {
	cookieName := "token"
	cookieMaxAge := 60 * 60 * 24 * 7

	http.SetCookie(w, &http.Cookie{
		Name:     cookieName,
		Value:    value,
		Path:     "/",
		HttpOnly: true,
		MaxAge:   cookieMaxAge,
		SameSite: http.SameSiteLaxMode,
		Secure:   false,
	})
}

func GetCookie(r *http.Request, name string) (string, error) {
	cookie, err := r.Cookie(name)
	if err != nil {
		return "", errors.New("no cookie was found")
	}
	return cookie.Value, nil
}
