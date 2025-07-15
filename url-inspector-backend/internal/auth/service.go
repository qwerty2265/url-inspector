package auth

import (
	"errors"
	"fmt"
	"url-inspector-backend/internal/common/util"
	"url-inspector-backend/internal/user"

	"golang.org/x/crypto/bcrypt"
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

	fmt.Printf("Registering user: %+v\n", inputUser)

	existingUser, err := s.userService.GetUserByEmail(*inputUser.Email)
	if err != nil && err != gorm.ErrRecordNotFound {
		return "", err
	}
	if existingUser != nil {
		return "", errors.New("user email must be unique")
	}

	if inputUser.Password == nil || *inputUser.Password == "" {
		return "", errors.New("password is required")
	}
	if err := ValidatePassword(*inputUser.Password); err != nil {
		return "", err
	}

	passwordBytes := []byte(*inputUser.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(passwordBytes, bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	*inputUser.Password = string(hashedPassword)

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

	if err := bcrypt.CompareHashAndPassword([]byte(*existingUser.Password), []byte(*inputUser.Password)); err != nil {
		return "", errors.New("invalid password or email")
	}

	token, err := util.GenerateJWT(existingUser.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}
