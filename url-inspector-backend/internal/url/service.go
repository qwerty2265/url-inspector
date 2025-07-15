package url

import (
	"errors"
	"fmt"
)

type URLService interface {
	CreateURL(input string, userID uint) (*URL, error)
	GetAllURLsByUserID(userID uint) ([]URL, error)
	GetURLByID(id uint, userID uint) (*URL, error)
	UpdateURL(url *URL) error
	DeleteURLByID(id uint, userID uint) error
	AnalyzeNextQueued() (*URL, error)
}

type urlService struct {
	repo URLRepository
}

func NewURLService(repo URLRepository) URLService {
	return &urlService{repo}
}

// ------------------------------------------------------------------------

func (s *urlService) CreateURL(input string, userID uint) (*URL, error) {
	url := &URL{
		URL:    input,
		Status: StatusQueued,
		UserID: uint(userID),
	}
	return s.repo.CreateURL(url)
}

func (s *urlService) GetAllURLsByUserID(userID uint) ([]URL, error) {
	return s.repo.GetAllURLsByUserID(uint(userID))
}

func (s *urlService) GetURLByID(id uint, userID uint) (*URL, error) {
	return s.repo.GetURLByID(id)
}

func (s *urlService) UpdateURL(url *URL) error {
	if url.Status == StatusRunning {
		return errors.New("cannot update URL while it is running")
	}
	return s.repo.UpdateURL(url)
}

func (s *urlService) DeleteURLByID(id uint, userID uint) error {
	return s.repo.DeleteURLByID(id)
}

func (s *urlService) AnalyzeNextQueued() (*URL, error) {
	url, err := s.repo.GetNextQueued()
	if err != nil {
		return nil, err
	}
	if url == nil {
		return nil, nil
	}

	url.Status = StatusRunning
	_ = s.repo.UpdateURL(url)

	err = analyzeURL(url)
	if err != nil {
		url.Status = StatusError
		fmt.Println("worker: analyze error:", err)
	}

	url.Status = StatusDone
	s.repo.UpdateURL(url)

	fmt.Println("worker: analyze success")
	return url, nil
}
