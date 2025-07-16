package auth

import (
	"url-inspector-backend/internal/common/middleware"

	"github.com/go-chi/chi/v5"
)

func AuthRouter(authHandler AuthHandler) chi.Router {
	r := chi.NewRouter()

	r.Post("/register", middleware.ErrorWrapper(authHandler.RegisterUser))
	r.Post("/login", middleware.ErrorWrapper(authHandler.LoginUser))

	r.Group(func(r chi.Router) {
		r.Use(middleware.AuthMiddleware)
		r.Post("/logout", middleware.ErrorWrapper(authHandler.LogoutUser))
		r.Get("/check", middleware.ErrorWrapper(authHandler.CheckAuth))
	})

	return r
}
