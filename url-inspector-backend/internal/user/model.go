package user

import (
	"errors"
	"strings"
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      *string   `gorm:"size:50;not null" json:"name,omitempty"`
	Surname   *string   `gorm:"size:100;not null" json:"surname,omitempty"`
	Email     *string   `gorm:"size:255;not null;unique" json:"email,omitempty"`
	Password  *string   `gorm:"size:255;not null" json:"password,omitempty"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at,omitempty"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at,omitempty"`
}

func (u *User) Validate() error {
	if u.Name == nil || strings.TrimSpace(*u.Name) == "" {
		return errors.New("user name is required")
	}
	if u.Surname == nil || strings.TrimSpace(*u.Surname) == "" {
		return errors.New("user surname is required")
	}
	if u.Email == nil || strings.TrimSpace(*u.Email) == "" {
		return errors.New("user email is required")
	}
	if u.Password == nil || strings.TrimSpace(*u.Password) == "" {
		return errors.New("user password is required")
	}

	return nil
}
