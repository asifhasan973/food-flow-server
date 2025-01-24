# **Food Flow Server**

This is the backend server for the Food Flow platform. It handles user authentication, food item management, and communication with the MongoDB database.

---

## **Features**

- **RESTful API**:
  - CRUD operations for managing food items.
  - Authentication and user validation.
- **Database Integration**:
  - MongoDB for storing and retrieving food and user data.
- **Secure Routes**:
  - JWT-based authentication for private routes.
- **Error Handling**:
  - Centralized error responses for better API debugging.
- **Performance**:
  - Optimized queries and reusable database connection.

---

## **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Authentication & JWT
- **Environment Variables**: dotenv

---

## **API Endpoints**

### **Foods**

- **GET** `/foods`  
  Fetch all available food items.
- **GET** `/foods/:id`  
  Fetch a single food item by ID.

- **POST** `/foods`  
  Add a new food item.

- **PUT** `/foods/:id`  
  Update an existing food item by ID.

- **DELETE** `/foods/:id`  
  Delete a food item by ID.

### **User-Specific**

- **GET** `/foods/email/:email`  
  Fetch all food items added by a specific user.

---
