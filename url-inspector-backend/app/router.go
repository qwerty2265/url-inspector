package app

import (
	"url-inspector-backend/internal/auth"
	"url-inspector-backend/internal/url"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func NewRouter(
	urlHandler *url.UrlHandler,
	authHandler *auth.AuthHandler,
) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Recoverer)
	r.Use(middleware.Logger)

	corsOptions := cors.Options{
		AllowedOrigins:   []string{"http://localhost", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
		Debug:            true,
	}

	r.Use(cors.Handler(corsOptions))

	r.Route("/api", func(r chi.Router) {
		r.Mount("/url", url.URLRouter(*urlHandler))
		r.Mount("/auth", auth.AuthRouter(*authHandler))
	})

	return r
}
