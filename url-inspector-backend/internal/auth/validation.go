package auth

import "errors"

const (
	MinPasswordLength = 9
	MaxPasswordLength = 100
)

func ValidatePassword(password string) error {
	if len(password) < MinPasswordLength {
		return errors.New("password must be at least 9 characters long")
	}
	if len(password) > MaxPasswordLength {
		return errors.New("password must be at most 100 characters long")
	}
	return nil
}
