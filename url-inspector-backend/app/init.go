package app

import (
	"url-inspector-backend/internal/auth"
	"url-inspector-backend/internal/common/db"
	"url-inspector-backend/internal/url"
	"url-inspector-backend/internal/user"
)

func InitializeApp() (*url.UrlHandler, *auth.AuthHandler) {
	database := db.ConnectDB()
	db.Migrate(database)

	urlRepo := url.NewURLRepository(database)
	userRepo := user.NewUserRepository(database)

	urlService := url.NewURLService(urlRepo)
	userService := user.NewUserService(userRepo)
	authService := auth.NewAuthService(userService)

	url.StartURLWorker(urlService)

	urlHandler := url.NewURLHandler(urlService)
	authHandler := auth.NewAuthHandler(authService)

	return urlHandler, authHandler
}
