package url

import (
	"gorm.io/gorm"
)

type URLRepository interface {
	CreateURL(url *URL) (*URL, error)
	GetAllURLsByUserID(userId uint) ([]URL, error)
	GetURLByID(id uint) (*URL, error)
	UpdateURL(url *URL) error
	DeleteURLByID(id uint) error
	GetNextQueued() (*URL, error)
}

type urlRepository struct {
	db *gorm.DB
}

func NewURLRepository(db *gorm.DB) URLRepository {
	return &urlRepository{db: db}
}

//-----------------------------------------------------------------------

func (r *urlRepository) CreateURL(url *URL) (*URL, error) {
	if err := r.db.Create(url).Error; err != nil {
		return nil, err
	}
	return url, nil
}

func (r *urlRepository) GetAllURLsByUserID(userID uint) ([]URL, error) {
	var urls []URL
	err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&urls).Error
	return urls, err
}

func (r *urlRepository) GetURLByID(id uint) (*URL, error) {
	var url URL
	err := r.db.First(&url, id).Error
	return &url, err
}

func (r *urlRepository) UpdateURL(url *URL) error {
	return r.db.Save(url).Error
}

func (r *urlRepository) DeleteURLByID(id uint) error {
	return r.db.Delete(&URL{}, id).Error
}

func (r *urlRepository) GetNextQueued() (*URL, error) {
	var url URL
	err := r.db.Where("status = ?", "queued").First(&url).Error
	return &url, err
}
