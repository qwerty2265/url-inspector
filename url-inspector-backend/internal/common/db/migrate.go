package db

import (
	"log"
	"url-inspector-backend/internal/url"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(
		&url.URL{},
	)

	if err != nil {
		log.Fatalf("❌ Failed to migrate database: %v", err)
	}

	log.Println("🚚 Migrations has been successfully applied")
}
