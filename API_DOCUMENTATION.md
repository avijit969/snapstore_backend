# API Documentation

## Base URL
`http://localhost:3001/api/v1` (or your deployed URL)

## Authentication
Most endpoints are protected and require authentication.
- **Method:** `Bearer Token` or `Cookies (accessToken)`
- The API checks for `accessToken` in cookies or the `Authorization` header.

---

## 1. Health Check

### Get Health Status
- **Endpoint:** `/health/`
- **Method:** `GET`
- **Description:** Checks if the server is running correctly.
- **Response:**
  ```json
  {
    "message": "Everything is fine here 👍...."
  }
  ```

---

## 2. User User Management

### Register User
- **Endpoint:** `/users/registerUser`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "username": "johndoe",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "65...",
      "username": "johndoe",
      "email": "johndoe@example.com",
      "fullName": "John Doe",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "message": "User registered Successfully",
    "success": true
  }
  ```

### Login User
- **Endpoint:** `/users/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "johndoe", 
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": { ... },
      "accessToken": "...",
      "refreshToken": "..."
    },
    "message": "user logged in successfully",
    "success": true
  }
  ```

### Get Current User
- **Endpoint:** `/users/get-user`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": { 
      "_id": "65a123bcde456fgh7890ijkl",
      "username": "aviji",
      "email": "aviji@example.com",
      "fullName": "Avijit",
      "avatar": "http://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "__v": 0
    },
    "message": "User fetched successfully",
    "success": true
  }
  ```

### Logout User
- **Endpoint:** `/users/logout`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "user logged Out",
    "success": true
  }
  ```

### Update Avatar
- **Endpoint:** `/users/avatar`
- **Method:** `PATCH`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
  - `avatar`: File (image)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": { ...updatedUser },
    "message": "Avatar image is updated successfully",
    "success": true
  }
  ```

### Get Profile
- **Endpoint:** `/users/profile`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "65a123bcde456fgh7890ijkl",
      "username": "avi",
      "email": "avi@example.com",
      "fullName": "John Doe",
      "avatar": "http://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "__v": 0
    },
    "message": "Successfully fetched the profile!",
    "success": true
  }
  ```

### Change Password
- **Endpoint:** `/users/changePassword`
- **Method:** `PATCH`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "oldPassword": "oldpassword",
    "newPassword": "newpassword"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "password changed successfully",
    "success": true
  }
  ```

### Update User Info
- **Endpoint:** `/users/update-profile`
- **Method:** `PATCH`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** (multipart/form-data or json)
  - `email`: (optional)
  - `fullName`: (optional)
  - `username`: (optional)
  - `avatar`: (optional file)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": { ...updatedUser },
    "message": "Profile updated successfully",
    "success": true
  }
  ```

### Forgot Password Flow
1. **Send OTP:**
   - **Endpoint:** `/users/send-otp-for-forgotPassword`
   - **Method:** `POST`
   - **Body:** `{ "email": "user@example.com" }`
2. **Verify OTP:**
   - **Endpoint:** `/users/verify-otp-for-forgotPassword`
   - **Method:** `POST`
   - **Body:** `{ "otp": "123456" }`
3. **Resend OTP:**
   - **Endpoint:** `/users/resend-otp-for-forgotPassword`
   - **Method:** `POST`
4. **Reset Password:**
   - **Endpoint:** `/users/forgot-password`
   - **Method:** `POST`
   - **Body:** `{ "password": "newSecurePassword" }`

---

## 3. Photo Management

### Upload Multiple Photos
- **Endpoint:** `/photos/upload`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
  - `photos`: Array of files (max 10)
  - `description`: (optional) string
  - `location`: (optional) string
- **Response:**
  ```json
  {
    "message": "Images uploaded successfully",
    "photos": [ ... ]
  }
  ```

### Upload Single Photo
- **Endpoint:** `/photos/upload-single`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
  - `photo`: File
  - `description`: (optional) string
  - `location`: (optional) string
  - `localAssetId`: (optional) string
  - `creationDateTime`: (optional) number (timestamp)
  - `height`: (optional) number
  - `width`: (optional) number
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": { ...photo },
    "message": "Image uploaded successfully",
    "success": true
  }
  ```

### Get All Photos
- **Endpoint:** `/photos/all-photo`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `page`: number (default 1)
  - `limit`: number (default 30)
- **Response:** Returns paginated list of photos (cached via Redis).

### Delete Photo
- **Endpoint:** `/photos/delete/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "message": "Photo deleted successfully"
  }
  ```

### Get Photos by Date Range
- **Endpoint:** `/photos/all-photos-by-date-range`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `startCreationDateTime`: number (timestamp)
  - `endCreationDateTime`: number (timestamp)
- **Response:** Returns list of photos within the range.

---

## 4. Album Management

### Create Album
- **Endpoint:** `/albums/create-album`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "Vacation 2024",
    "description": "Photos from our trip"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "data": { ...album },
    "message": "album crated successfully",
    "success": true
  }
  ```

### Delete Album
- **Endpoint:** `/albums/album/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": { ...deletedAlbum },
    "message": "album deleted successfully",
    "success": true
  }
  ```

### Get All Albums
- **Endpoint:** `/albums/album`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": [ ...albums ],
    "message": "all albums retrieved successfully",
    "success": true
  }
  ```

### Add Photos to Album
- **Endpoint:** `/albums/add-photo-to-album/:id`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "photoIdArray": ["photoId1", "photoId2"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Photos added to album successfully",
    "updatedPhotos": { ... }
  }
  ```

### Get Album Photos
- **Endpoint:** `/albums/all-photos/:albumId`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": [ ...photos ],
    "message": "All photos of the album",
    "success": true
  }
  ```

### Add Album Cover Image
- **Endpoint:** `/albums/add-album-cover-image/:id`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "photoId": "validPhotoId"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": { ...album },
    "message": "Album cover image added successfully",
    "success": true
  }
  ```

### Edit Album
- **Endpoint:** `/albums/edit-album/:id`
- **Method:** `PATCH`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "New Name",
    "description": "New Description"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "data": { ...updatedAlbum },
    "message": "Album updated successfully",
    "success": true
  }
  ```
