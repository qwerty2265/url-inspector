package user

import (
	"errors"

	"gorm.io/gorm"
)

type UserService interface {
	CreateUser(user *User) error
	GetUserByID(id uint) (*User, error)
	GetUserByEmail(userEmail string) (*User, error)
}

type userService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) UserService {
	return &userService{repo: repo}
}

//-----------------------------------------------------------------------

func (s *userService) CreateUser(inputUser *User) error {
	if err := inputUser.Validate(); err != nil {
		return err
	}

	existingUserByEmail, err := s.repo.GetUserByEmail(*inputUser.Email)
	if err != nil && err != gorm.ErrRecordNotFound {
		return err
	}
	if existingUserByEmail != nil {
		return errors.New("user email must be unique")
	}

	return s.repo.CreateUser(inputUser)
}

func (s *userService) GetUserByID(id uint) (*User, error) {
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) GetUserByEmail(userEmail string) (*User, error) {
	user, err := s.repo.GetUserByEmail(userEmail)
	if err != nil {
		return nil, err
	}

	return user, nil
}
