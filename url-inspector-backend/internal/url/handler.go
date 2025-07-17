package url

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"url-inspector-backend/internal/common"
	"url-inspector-backend/internal/common/middleware"
	"url-inspector-backend/internal/common/util"

	"github.com/go-chi/chi/v5"
)

type UrlHandler struct {
	urlService URLService
}

func NewURLHandler(urlService URLService) *UrlHandler {
	return &UrlHandler{urlService: urlService}
}

// ---------------------------------------------------

func (h *UrlHandler) AddURL(w http.ResponseWriter, r *http.Request) error {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*util.Claims)
	if !ok || claims == nil {
		return errors.New("unauthorized")
	}

	userID, err := strconv.ParseUint(claims.UserID, 10, 64)
	if err != nil {
		return errors.New("invalid user ID in token")
	}

	var input struct {
		URL string `json:"url"`
	}
	if err := util.DecodeJSONBody(w, r, &input); err != nil {
		return err
	}

	responseUrl, err := h.urlService.CreateURL(input.URL, uint(userID))
	if err != nil {
		return err
	}

	response := common.Response{
		Success: true,
		Message: "URL added successfully",
		Data: map[string]interface{}{
			"id":         responseUrl.ID,
			"status":     responseUrl.Status,
			"url":        responseUrl.URL,
			"created_at": responseUrl.CreatedAt,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (h *UrlHandler) StopURL(w http.ResponseWriter, r *http.Request) error {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*util.Claims)
	if !ok || claims == nil {
		return errors.New("unauthorized")
	}
	userID, _ := strconv.ParseUint(claims.UserID, 10, 64)
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.ParseUint(idStr, 10, 64)

	if err := h.urlService.StopURLByID(uint(id), uint(userID)); err != nil {
		return err
	}

	response := common.Response{
		Success: true,
		Message: "URL stopped successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (h *UrlHandler) ResumeURL(w http.ResponseWriter, r *http.Request) error {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*util.Claims)
	if !ok || claims == nil {
		return errors.New("unauthorized")
	}
	userID, _ := strconv.ParseUint(claims.UserID, 10, 64)
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.ParseUint(idStr, 10, 64)

	if err := h.urlService.ResumeURLByID(uint(id), uint(userID)); err != nil {
		return err
	}
	response := common.Response{
		Success: true,
		Message: "URL resumed successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (h *UrlHandler) GetURL(w http.ResponseWriter, r *http.Request) error {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*util.Claims)
	if !ok || claims == nil {
		return errors.New("unauthorized")
	}
	userID, _ := strconv.ParseUint(claims.UserID, 10, 64)
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.ParseUint(idStr, 10, 64)

	url, err := h.urlService.GetURLByID(uint(id), uint(userID))
	if err != nil {
		return err
	}

	response := common.Response{
		Success: true,
		Message: "URL retrieved successfully",
		Data:    url,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (h *UrlHandler) GetAllURLs(w http.ResponseWriter, r *http.Request) error {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*util.Claims)
	if !ok || claims == nil {
		return errors.New("unauthorized")
	}
	userID, _ := strconv.ParseUint(claims.UserID, 10, 64)

	urls, err := h.urlService.GetAllURLsByUserID(uint(userID))
	if err != nil {
		return err
	}

	response := common.Response{
		Success: true,
		Message: "URLs retrieved successfully",
		Data:    urls,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (h *UrlHandler) DeleteURL(w http.ResponseWriter, r *http.Request) error {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*util.Claims)
	if !ok || claims == nil {
		return errors.New("unauthorized")
	}
	userID, _ := strconv.ParseUint(claims.UserID, 10, 64)
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.ParseUint(idStr, 10, 64)

	if err := h.urlService.DeleteURLByID(uint(id), uint(userID)); err != nil {
		return err
	}

	response := common.Response{
		Success: true,
		Message: "URL deleted successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return nil
}
