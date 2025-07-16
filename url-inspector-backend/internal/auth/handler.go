package auth

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"
	"url-inspector-backend/internal/common"
	"url-inspector-backend/internal/common/middleware"
	"url-inspector-backend/internal/common/util"
	"url-inspector-backend/internal/user"
)

type AuthHandler struct {
	authService AuthService
}

func NewAuthHandler(authService AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// ------------------------------------------------------------------------

func (h *AuthHandler) RegisterUser(w http.ResponseWriter, r *http.Request) error {
	var user *user.User
	if err := util.DecodeJSONBody(w, r, &user); err != nil {
		return err
	}
	token, err := h.authService.RegisterUser(user)
	if err != nil {
		return err
	}

	util.SetCookie(w, token, true)

	response := common.Response{
		Success: true,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (h *AuthHandler) LoginUser(w http.ResponseWriter, r *http.Request) error {
	var user *user.User
	if err := util.DecodeJSONBody(w, r, &user); err != nil {
		return err
	}
	token, err := h.authService.LoginUser(user)
	if err != nil {
		return err
	}

	util.SetCookie(w, token, true)

	response := common.Response{
		Success: true,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (h *AuthHandler) LogoutUser(w http.ResponseWriter, r *http.Request) error {
	cookiesToDelete := []string{"token"}
	for _, name := range cookiesToDelete {
		http.SetCookie(w, &http.Cookie{
			Name:     name,
			Value:    "",
			Path:     "/",
			Expires:  time.Unix(0, 0),
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteLaxMode,
		})
	}

	response := common.Response{
		Success: true,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (h *AuthHandler) CheckAuth(w http.ResponseWriter, r *http.Request) error {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*util.Claims)
	if !ok || claims == nil {
		return errors.New("unauthorized")
	}

	response := common.Response{
		Success: true,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}
