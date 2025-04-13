package main

import (
	"testing"
	"strings"
	"math"
	"net/http"
	"net/http/httptest"
	"encoding/json"
	"errors"
)

// Simple function to test
func Add(a, b int) int {
	return a + b
}

// Test for the Add function
func TestAdd(t *testing.T) {
	result := Add(2, 3)
	expected := 5
	
	if result != expected {
		t.Errorf("Add(2, 3) = %d; expected %d", result, expected)
	}
}

// Table-driven test for the Add function
func TestAddTableDriven(t *testing.T) {
	tests := []struct {
		name     string
		a, b     int
		expected int
	}{
		{"positive numbers", 2, 3, 5},
		{"negative numbers", -2, -3, -5},
		{"mixed numbers", -2, 3, 1},
		{"zeros", 0, 0, 0},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := Add(tt.a, tt.b)
			if result != tt.expected {
				t.Errorf("Add(%d, %d) = %d; expected %d", 
					tt.a, tt.b, result, tt.expected)
			}
		})
	}
}

// String utility function to test
func ToUpperCase(s string) string {
	return strings.ToUpper(s)
}

// Test for the ToUpperCase function
func TestToUpperCase(t *testing.T) {
	result := ToUpperCase("hello")
	expected := "HELLO"
	
	if result != expected {
		t.Errorf("ToUpperCase(\"hello\") = %s; expected %s", result, expected)
	}
}

// Function that may return an error
func Sqrt(x float64) (float64, error) {
	if x < 0 {
		return 0, errors.New("cannot take square root of negative number")
	}
	return math.Sqrt(x), nil
}

// Test for function that returns error
func TestSqrt(t *testing.T) {
	// Test valid input
	t.Run("valid input", func(t *testing.T) {
		result, err := Sqrt(4)
		if err != nil {
			t.Errorf("Unexpected error: %v", err)
		}
		expected := 2.0
		if result != expected {
			t.Errorf("Sqrt(4) = %f; expected %f", result, expected)
		}
	})
	
	// Test error case
	t.Run("negative input", func(t *testing.T) {
		_, err := Sqrt(-4)
		if err == nil {
			t.Error("Expected error for negative input, got nil")
		}
	})
}

// Example struct to test
type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}

// Function to test with struct
func ValidateUser(u User) error {
	if u.Name == "" {
		return errors.New("name cannot be empty")
	}
	if u.Age < 0 {
		return errors.New("age cannot be negative")
	}
	return nil
}

// Test struct validation
func TestValidateUser(t *testing.T) {
	tests := []struct {
		name        string
		user        User
		expectError bool
	}{
		{"valid user", User{1, "John", 30}, false},
		{"empty name", User{2, "", 25}, true},
		{"negative age", User{3, "Alice", -5}, true},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateUser(tt.user)
			
			if (err != nil) != tt.expectError {
				t.Errorf("ValidateUser() error = %v, expectError %v", 
					err, tt.expectError)
			}
		})
	}
}

// HTTP handler to test
func UserHandler(w http.ResponseWriter, r *http.Request) {
	user := User{1, "John Doe", 30}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Test HTTP handler
func TestUserHandler(t *testing.T) {
	req := httptest.NewRequest("GET", "/user", nil)
	w := httptest.NewRecorder()
	
	UserHandler(w, req)
	
	if w.Code != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, w.Code)
	}
	
	contentType := w.Header().Get("Content-Type")
	expected := "application/json"
	if contentType != expected {
		t.Errorf("Expected Content-Type %s, got %s", expected, contentType)
	}
	
	var user User
	err := json.NewDecoder(w.Body).Decode(&user)
	if err != nil {
		t.Fatalf("Failed to decode response body: %v", err)
	}
	
	if user.ID != 1 || user.Name != "John Doe" || user.Age != 30 {
		t.Errorf("Unexpected user data: %+v", user)
	}
}

// Mock interface for testing
type DataStore interface {
	GetUser(id int) (User, error)
}

// Mock implementation
type MockDataStore struct {
	users map[int]User
}

func (m MockDataStore) GetUser(id int) (User, error) {
	user, exists := m.users[id]
	if !exists {
		return User{}, errors.New("user not found")
	}
	return user, nil
}

// Service that uses the interface
type UserService struct {
	store DataStore
}

func (s UserService) GetUserName(id int) (string, error) {
	user, err := s.store.GetUser(id)
	if err != nil {
		return "", err
	}
	return user.Name, nil
}

// Test with mock
func TestUserService(t *testing.T) {
	// Create mock data store
	mockStore := MockDataStore{
		users: map[int]User{
			1: {1, "John", 30},
			2: {2, "Alice", 25},
		},
	}
	
	// Initialize service with mock
	service := UserService{store: mockStore}
	
	// Test existing user
	t.Run("existing user", func(t *testing.T) {
		name, err := service.GetUserName(1)
		if err != nil {
			t.Errorf("Unexpected error: %v", err)
		}
		expected := "John"
		if name != expected {
			t.Errorf("Expected name %q, got %q", expected, name)
		}
	})
	
	// Test non-existing user
	t.Run("non-existing user", func(t *testing.T) {
		_, err := service.GetUserName(999)
		if err == nil {
			t.Error("Expected error for non-existing user, got nil")
		}
	})
}

// Benchmark example
func BenchmarkAdd(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Add(2, 3)
	}
}