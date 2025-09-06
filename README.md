# College Event Management System

A comprehensive College Event Management System built with Java Spring Boot 3, featuring REST APIs for managing colleges, students, events, registrations, attendance, and feedback.

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Spring Security**
- **JWT Authentication**
- **SQLite Database**
- **Maven Build System**
- **Spring Boot Actuator**

### Frontend
- **React 18**
- **Material-UI (MUI)**
- **Vite**
- **Axios**
- **React Router DOM**

## Features

### 1. Authentication & Authorization
- **JWT-based authentication**
- **Role-based access control (Admin/User)**
- **User registration and login**
- **Protected routes and API endpoints**
- **Admin user management**

### 2. College Management (Admin Only)
- Add a college
- List all colleges
- Update college details
- Delete college

### 3. Student Management
- Add a student (linked to a college)
- List students
- Search by studentId, name, or email
- Update student details
- Delete student

### 4. Event Management
- Create an event (linked to a college)
- List all events
- Get details of an event
- Search events by name or description
- Filter by event type, date range, or college
- Update event details
- Delete event

### 5. Registration
- Register student to an event
- View all registrations for an event
- Cancel registration
- Check registration count

### 6. Attendance
- Mark attendance for a student in an event
- Mark absent
- Get attendance by eventId or studentId
- View present/absent lists

### 7. Feedback
- Submit feedback for an event
- Update feedback
- View all feedback for an event
- Get average rating and feedback count

### 8. Reports (Admin Only)
- Event popularity report (number of registrations per event)
- Attendance report (per event)
- Overall statistics

### 9. User Management (Admin Only)
- Create, update, delete users
- Manage user roles (Admin/User)
- Activate/deactivate users
- View all users

## Prerequisites

- Java 21 or higher
- Maven 3.6 or higher
- Node.js 16 or higher (for frontend)
- npm or yarn (for frontend)

## Setup and Run

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-event-management
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the backend**
   - Application will start on `http://localhost:8080`
   - Health check: `http://localhost:8080/actuator/health`
   - API Base URL: `http://localhost:8080/api`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

4. **Access the frontend**
   - Frontend URL: `http://localhost:5173`

### Default Users

The system creates default users on startup:

- **Admin User:**
  - Username: `admin`
  - Password: `admin123`
  - Role: ADMIN

- **Regular User:**
  - Username: `user`
  - Password: `user123`
  - Role: USER

## Database

The application uses SQLite database (`event_system.db`) which will be created automatically in the project root directory when you first run the application.

## API Documentation

### Authentication

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

#### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@college.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User"
  }'
```

#### Get Current User
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### User Management (Admin Only)

#### Get All Users
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "newuser",
    "email": "newuser@college.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User",
    "role": "USER",
    "isActive": true
  }'
```

#### Update User Role
```bash
curl -X PUT http://localhost:8080/api/users/1/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "role": "ADMIN"
  }'
```

### College Management (Admin Only)

#### Add College
```bash
curl -X POST http://localhost:8080/api/colleges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Acharya Institute of Technology",
    "address": "Soldevanahalli, Chikkabanavara Post",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India"
  }'
```

#### Get All Colleges
```bash
curl -X GET http://localhost:8080/api/colleges
```

#### Get College by ID
```bash
curl -X GET http://localhost:8080/api/colleges/1
```

#### Update College
```bash
curl -X PUT http://localhost:8080/api/colleges/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acharya Institute of Technology",
    "address": "Updated Address",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India"
  }'
```

#### Delete College
```bash
curl -X DELETE http://localhost:8080/api/colleges/1
```

### Student Management

#### Add Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "AIT001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "9876543210",
    "department": "Computer Science",
    "yearOfStudy": "3rd",
    "college": {
      "id": 1
    }
  }'
```

#### Get All Students
```bash
curl -X GET http://localhost:8080/api/students
```

#### Get Student by Student ID
```bash
curl -X GET http://localhost:8080/api/students/student-id/AIT001
```

#### Search Students
```bash
curl -X GET "http://localhost:8080/api/students/search?q=John"
```

#### Get Students by College
```bash
curl -X GET http://localhost:8080/api/students/college/1
```

### Event Management

#### Create Event
```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Symposium 2024",
    "description": "Annual technology symposium featuring latest innovations",
    "eventDate": "2024-03-15T10:00:00",
    "location": "Main Auditorium",
    "maxCapacity": 200,
    "eventType": "Conference",
    "college": {
      "id": 1
    }
  }'
```

#### Get All Events
```bash
curl -X GET http://localhost:8080/api/events
```

#### Get Active Events
```bash
curl -X GET http://localhost:8080/api/events/active
```

#### Get Available Events
```bash
curl -X GET http://localhost:8080/api/events/available
```

#### Search Events
```bash
curl -X GET "http://localhost:8080/api/events/search?q=Tech"
```

#### Get Events by Type
```bash
curl -X GET http://localhost:8080/api/events/type/Conference
```

#### Get Events by Date Range
```bash
curl -X GET "http://localhost:8080/api/events/date-range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59"
```

### Registration Management

#### Register Student to Event
```bash
curl -X POST "http://localhost:8080/api/registrations/register?studentId=1&eventId=1"
```

#### Get Registrations by Event
```bash
curl -X GET http://localhost:8080/api/registrations/event/1
```

#### Get Registrations by Student
```bash
curl -X GET http://localhost:8080/api/registrations/student/1
```

#### Get Registration Count
```bash
curl -X GET http://localhost:8080/api/registrations/event/1/count
```

#### Cancel Registration
```bash
curl -X DELETE "http://localhost:8080/api/registrations/cancel?studentId=1&eventId=1"
```

### Attendance Management

#### Mark Attendance
```bash
curl -X POST "http://localhost:8080/api/attendance/mark?studentId=1&eventId=1"
```

#### Mark Absent
```bash
curl -X POST "http://localhost:8080/api/attendance/mark-absent?studentId=1&eventId=1"
```

#### Get Attendance by Event
```bash
curl -X GET http://localhost:8080/api/attendance/event/1
```

#### Get Attendance by Student
```bash
curl -X GET http://localhost:8080/api/attendance/student/1
```

#### Get Present Attendance by Event
```bash
curl -X GET http://localhost:8080/api/attendance/event/1/present
```

#### Get Attendance Count
```bash
curl -X GET http://localhost:8080/api/attendance/event/1/count
```

### Feedback Management

#### Submit Feedback
```bash
curl -X POST "http://localhost:8080/api/feedback/submit?studentId=1&eventId=1&rating=5&comment=Excellent event!"
```

#### Update Feedback
```bash
curl -X PUT "http://localhost:8080/api/feedback/update?studentId=1&eventId=1&rating=4&comment=Updated comment"
```

#### Get Feedbacks by Event
```bash
curl -X GET http://localhost:8080/api/feedback/event/1
```

#### Get Average Rating
```bash
curl -X GET http://localhost:8080/api/feedback/event/1/average-rating
```

#### Get Feedback Count
```bash
curl -X GET http://localhost:8080/api/feedback/event/1/count
```

### Reports

#### Event Popularity Report
```bash
curl -X GET http://localhost:8080/api/reports/event-popularity
```

#### Attendance Report by Event
```bash
curl -X GET http://localhost:8080/api/reports/attendance/event/1
```

#### All Events Attendance Report
```bash
curl -X GET http://localhost:8080/api/reports/attendance/all
```

#### Overall Statistics
```bash
curl -X GET http://localhost:8080/api/reports/statistics
```

## Sample Data Setup

Here are some sample API calls to set up test data:

### 1. Create a College
```bash
curl -X POST http://localhost:8080/api/colleges \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acharya Institute of Technology",
    "address": "Soldevanahalli, Chikkabanavara Post",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India"
  }'
```

### 2. Create Students
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "AIT001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "9876543210",
    "department": "Computer Science",
    "yearOfStudy": "3rd",
    "college": {"id": 1}
  }'
```

### 3. Create Events
```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Symposium 2024",
    "description": "Annual technology symposium",
    "eventDate": "2024-03-15T10:00:00",
    "location": "Main Auditorium",
    "maxCapacity": 200,
    "eventType": "Conference",
    "college": {"id": 1}
  }'
```

## Health Check

The application includes Spring Boot Actuator for health monitoring:

- Health endpoint: `http://localhost:8080/actuator/health`
- Info endpoint: `http://localhost:8080/actuator/info`

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST requests
- `400 Bad Request` - Invalid input data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

## Database Schema

The application automatically creates the following tables:
- `colleges` - College information
- `students` - Student information
- `events` - Event information
- `registrations` - Student event registrations
- `attendances` - Attendance records
- `feedbacks` - Event feedback

## Development

### Running Tests
```bash
mvn test
```

### Building JAR
```bash
mvn clean package
```

### Running JAR
```bash
java -jar target/college-event-management-1.0.0.jar
```

## License

This project is licensed under the MIT License.