package util

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id,omitempty"`
	jwt.RegisteredClaims
}

func GenerateJWT(userID uint, userRole string) (string, error) {
	var jwtKey = []byte(os.Getenv("JWT_SECRET"))
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: fmt.Sprintf("%d", userID),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func ValidateJWT(tokenString string) (*Claims, error) {
	var jwtKey = []byte(os.Getenv("JWT_SECRET"))
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}
