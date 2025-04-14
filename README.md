# Macro Photography API Documentation

![API Overview](screenshots/postman_get_all_photos_test.png)

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoints](#api-endpoints)
3. [Authentication Flow](#authentication-flow)
4. [Testing Results](#testing-results)
5. [Setup Instructions](#setup-instructions)
6. [Database Schema](#database-schema)
7. [Error Handling](#error-handling)

## Introduction
A RESTful API for managing macro photography metadata with JWT authentication and PostgreSQL backend.

## API Endpoints

### Authentication
- **POST /api/auth/register**  
  Register a new user  
  ![Registration](screenshots/postman_user_registration_test.png)

- **POST /api/auth/login**  
  Generate JWT token  
  ![Login](screenshots/postman_login_token_generation_test.png)

### Photo Operations
- **GET /api/photos**  
  Get all photos (requires auth)  
  ![Get All](screenshots/postman_get_all_photos_test.png)

- **GET /api/photos/:id**  
  Get single photo  
  ![Get One](screenshots/postman_get_photo_test.png)

- **POST /api/photos**  
  Create new photo  
  ![Create](screenshots/postman_authenticated_photo_creation_test.png)

- **PUT /api/photos/:id**  
  Update photo  
  ![Update](screenshots/postman_update_test.png)

- **DELETE /api/photos/:id**  
  Delete photo  
  ![Delete](screenshots/postman_delete_test.png)

## Authentication Flow
1. Register user → Get credentials
2. Login with credentials → Receive JWT
3. Include JWT in Authorization header for protected routes

Unauthenticated access attempt:  
![No Auth](screenshots/postman_no_authentication_test.png)

## Testing Results

### Automated Test Suite
![Test Results](screenshots/npm_test_result.png)

**Test Coverage:**
- 100% endpoint coverage
- Authentication tests
- CRUD operation tests
- Error case testing

## Setup Instructions

### Requirements
- Node.js 16+
- PostgreSQL 12+
- npm/yarn

### Installation
```bash
# Clone repository
git clone https://github.com/khyron/Desafio_Latam_Hito_5.git
cd Desafio_Latam_Hito_5

# Install dependencies
npm install

# Configure environment
cp env.example .env
# Edit .env with your credentials

# Initialize database
node src/initDB.js

# Start server
npm start
