package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"url-inspector-backend/internal/common"
	"url-inspector-backend/internal/common/util"
)

type contextKey string

const UserContextKey = contextKey("user")

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookieValue, err := util.GetCookie(r, "token")
		if err != nil {
			response := common.Response{
				Success: false,
				Message: "unauthorized",
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(response)
			return
		}

		claims, err := util.ValidateJWT(cookieValue)
		if err != nil || claims == nil {
			response := common.Response{
				Success: false,
				Message: "invalid token",
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(response)
			return
		}

		ctx := context.WithValue(r.Context(), UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
