package url

import (
	"errors"
	"fmt"
)

type URLService interface {
	CreateURL(input string, userID uint) (*URL, error)
	GetAllURLsByUserID(userID uint) ([]URL, error)
	GetURLByID(id uint, userID uint) (*URL, error)
	StopURLByID(id uint, userID uint) error
	ResumeURLByID(id uint, userID uint) error
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

func (s *urlService) StopURLByID(id uint, userID uint) error {
	url, err := s.repo.GetURLByID(id)
	if err != nil {
		return err
	}

	if url.UserID != userID {
		return errors.New("forbidden")
	}

	if url.Status != StatusRunning {
		return errors.New("URL is not currently running")
	}

	url.Status = StatusStopped
	return s.repo.UpdateURL(url)
}

func (s *urlService) ResumeURLByID(id uint, userID uint) error {
	url, err := s.repo.GetURLByID(id)
	if err != nil {
		return err
	}

	if url.UserID != userID {
		return errors.New("forbidden")
	}

	if url.Status != StatusStopped {
		return errors.New("URL is not currently stopped")
	}

	url.Status = StatusQueued
	return s.repo.UpdateURL(url)
}

func (s *urlService) DeleteURLByID(id uint, userID uint) error {
	url, err := s.repo.GetURLByID(id)
	if err != nil {
		return err
	}

	if url.UserID != userID {
		return errors.New("forbidden")
	}
	if url.Status == StatusRunning {
		return errors.New("cannot delete URL while it is running")
	}
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
	if err := s.repo.UpdateURL(url); err != nil {
		return nil, err
	}

	err = analyzeURL(url, s.repo)
	if err == nil {
		url.Status = StatusDone
		s.repo.UpdateURL(url)
		fmt.Print("Analyze success on url: " + url.URL)
	} else if err.Error() != "analysis stopped by user" {
		url.Status = StatusError
		s.repo.UpdateURL(url)
		fmt.Print("Analyze error on url: " + url.URL)
		return url, err
	}

	return url, nil
}
