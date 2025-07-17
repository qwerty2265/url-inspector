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
	r.Get("/{id}", middleware.ErrorWrapper(urlHandler.GetURL))
	r.Post("/stop/{id}", middleware.ErrorWrapper(urlHandler.StopURL))
	r.Post("/resume/{id}", middleware.ErrorWrapper(urlHandler.ResumeURL))
	r.Post("/delete/{id}", middleware.ErrorWrapper(urlHandler.DeleteURL))

	return r
}
