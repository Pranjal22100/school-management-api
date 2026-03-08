# School Management API

A REST API built with Node.js, Express.js, and MySQL to manage school data with proximity-based sorting.

## Project Structure
```
school-management/
├── src/
│   ├── config/db.js
│   ├── controllers/schoolController.js
│   ├── routes/schoolRoutes.js
│   └── server.js
├── database/setup.sql
├── postman/
├── .env.example
└── package.json
```

## Setup

1. Install Node.js and MySQL
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your MySQL credentials
4. Run `database/setup.sql` in MySQL Workbench to create the database and table
5. Start the server with `npm start`

## APIs

### POST /addSchool
Adds a new school to the database.

**Request Body:**
```json
{
  "name": "Delhi Public School",
  "address": "Sector 45, Gurugram",
  "latitude": 28.4089,
  "longitude": 77.0421
}
```

### GET /listSchools
Returns all schools sorted by distance from the given coordinates.

**Query Params:** `latitude`, `longitude`

## Distance Calculation

Uses the Haversine formula to calculate real-world distance between the user's location and each school, then sorts results in ascending order.

## Postman Collection

Import `postman/SchoolManagement.postman_collection.json` into Postman to test both APIs with example requests.
