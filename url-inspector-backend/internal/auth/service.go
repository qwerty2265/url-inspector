package auth

import (
	"errors"
	"url-inspector-backend/internal/common/util"
	"url-inspector-backend/internal/user"

	"gorm.io/gorm"
)

type AuthService interface {
	RegisterUser(user *user.User) (string, error)
	LoginUser(user *user.User) (string, error)
}

type authService struct {
	userService user.UserService
}

func NewAuthService(userService user.UserService) AuthService {
	return &authService{
		userService: userService,
	}
}

// ------------------------------------------------------------------------

func (s *authService) RegisterUser(inputUser *user.User) (string, error) {
	if err := inputUser.Validate(); err != nil {
		return "", err
	}

	existingUser, err := s.userService.GetUserByEmail(*inputUser.Email)
	if err != nil && err != gorm.ErrRecordNotFound {
		return "", err
	}
	if existingUser != nil {
		return "", errors.New("user email must be unique")
	}

	if err := s.userService.CreateUser(inputUser); err != nil {
		return "", err
	}

	token, err := util.GenerateJWT(inputUser.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *authService) LoginUser(inputUser *user.User) (string, error) {
	if inputUser.Email == nil || inputUser.Password == nil {
		return "", errors.New("email and password are required")
	}

	existingUser, err := s.userService.GetUserByEmail(*inputUser.Email)
	if err != nil {
		return "", err
	}

	if existingUser == nil || *existingUser.Password != *inputUser.Password {
		return "", errors.New("invalid email or password")
	}

	token, err := util.GenerateJWT(existingUser.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}
