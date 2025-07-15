package url

import (
	"url-inspector-backend/internal/common/middleware"

	"github.com/go-chi/chi/v5"
)

func URLRouter(urlHandler UrlHandler) chi.Router {
	r := chi.NewRouter()

	r.Use(middleware.AuthMiddleware)
	r.Post("/analyze", middleware.ErrorWrapper(urlHandler.AddURL))
	r.Get("/all", middleware.ErrorWrapper(urlHandler.GetAllURLs))

	return r
}
