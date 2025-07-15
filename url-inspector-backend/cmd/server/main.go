package main

import (
	"log"
	"net/http"
	"os"

	"url-inspector-backend/app"
	"url-inspector-backend/internal/common/db"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("❌ Error loading .env file: %v", err)
	}
	log.Println("✅ .env file loaded successfully")
	serverPort := os.Getenv("SERVER_PORT")

	db.ConnectDB()

	urlHandler, authHandler := app.InitializeApp()

	r := app.NewRouter(urlHandler, authHandler)

	log.Printf("🚀 Server is running on port %v", serverPort)
	if err := http.ListenAndServe(":"+serverPort, r); err != nil {
		log.Fatalf("❌ The server failed to start: %v", err)
	}
}
