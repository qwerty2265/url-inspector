package url

import (
	"time"
	"url-inspector-backend/internal/user"

	"gorm.io/datatypes"
)

type BrokenLink struct {
	URL    string `json:"url" gorm:"type:varchar(255)"`
	Status string `json:"status" gorm:"type:varchar(20)"`
}

type URL struct {
	ID                 uint           `gorm:"primaryKey" json:"id"`
	URL                string         `gorm:"type:text" json:"url"`
	Status             string         `gorm:"type:varchar(20)" json:"status"`
	PageTitle          string         `gorm:"type:varchar(255)" json:"page_title,omitempty"`
	HTMLVersion        string         `gorm:"type:varchar(50)" json:"html_version,omitempty"`
	H1Count            int            `gorm:"default:0;not null" json:"h1_count"`
	H2Count            int            `gorm:"default:0;not null" json:"h2_count"`
	H3Count            int            `gorm:"default:0;not null" json:"h3_count"`
	H4Count            int            `gorm:"default:0;not null" json:"h4_count"`
	H5Count            int            `gorm:"default:0;not null" json:"h5_count"`
	H6Count            int            `gorm:"default:0;not null" json:"h6_count"`
	HasLoginForm       bool           `gorm:"not null;default:false" json:"visible,omitempty"`
	InternalLinksCount int            `gorm:"default:0;not null" json:"internal_links_count"`
	ExternalLinksCount int            `gorm:"default:0;not null" json:"external_links_count"`
	BrokenLinksCount   int            `gorm:"default:0;not null" json:"broken_links_count"`
	BrokenLinksList    datatypes.JSON `gorm:"serializer:json" json:"broken_links_list,omitempty"`
	UserID             uint           `gorm:"not null" json:"user_id"`
	User               user.User      `json:"-"`
	CreatedAt          time.Time      `gorm:"autoCreateTime" json:"created_at,omitempty"`
	UpdatedAt          time.Time      `gorm:"autoUpdateTime" json:"updated_at,omitempty"`
}

const (
	StatusQueued  = "queued"
	StatusRunning = "running"
	StatusDone    = "done"
	StatusError   = "error"
	StatusStopped = "stopped"
)
