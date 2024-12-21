# Task Master

A task management application built with HTML, CSS, and JavaScript that helps users organize and track their tasks efficiently.

## Features

- Create, read, update and delete tasks
- Assign tasks to users
- Set task priorities and due dates
- Track task status (NEW, ASSIGNED, IN_PROGRESS, COMPLETE)
- User authentication and authorization
- RESTful API endpoints

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Local Storage

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. Clone the repository

git clone https://github.com/kichuu/B41_WEB_003_Web_Wizards.git

2. Open the project folder and launch index.html in your web browser

   You can also use a local development server like Live Server for VS Code

3. Access the application directly through your web browser


## Testing

Open the developer tools in your browser to view console logs and test functionality.

# Task Management System Backend

A simple task management system built using Node.js, Express, MongoDB, and JWT authentication. This system allows users to manage tasks with features like creating, updating, and deleting tasks.

---

## Features

- User authentication using JWT (JSON Web Tokens).
- Create, read, update, and delete tasks.
- Secure password storage using bcrypt.
- Role-based access control for tasks.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Postman](https://www.postman.com/) (optional, for API testing)

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```plaintext
   MONGO_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   The server will run at `http://localhost:5000`.

---

## API Endpoints

### **User Routes**

#### **Register a User**
- **POST** `/api/users/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```

#### **Login a User**
- **POST** `/api/users/login`
- **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```


### **Task Routes**

#### **Create a Task**
- **POST** `/api/tasks`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <your_jwt_token>"
  }
  ```
- **Request Body:**
  ```json
  {
    "title": "Complete Project Report",
    "description": "Finalize and submit the project report by end of the day.",
    "status": "in-progress"
  }
  ```

#### **Get All Tasks**
- **GET** `/api/tasks`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <your_jwt_token>"
  }
  ```

#### **Update a Task**
- **PUT** `/api/tasks/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <your_jwt_token>"
  }
  ```
- **Request Body:**
  ```json
  {
    "title": "Complete Project Report (Updated)",
    "status": "completed"
  }
  ```

#### **Delete a Task**
- **DELETE** `/api/tasks/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <your_jwt_token>"
  }
  ```

---

## Folder Structure

```
project-folder/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── taskModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── README.md
```

---

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcrypt

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
