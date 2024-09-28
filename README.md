# IRCTC API

This API provides endpoints for managing train bookings, similar to the IRCTC system.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database and update the `DATABASE_URL` in `.env`
4. Set up other environment variables in `.env`:
   ```
   JWT_SECRET=your_jwt_secret
   ADMIN_API_KEY=your_admin_api_key
   ```
5. Run migrations: `npx prisma migrate dev`
6. Build the project: `npm run build`
7. Start the server: `npm start`

## API Endpoints

### Authentication

- POST /auth/register - Register a new user
- POST /auth/login - Login and receive a JWT token

### Trains

- POST /trains - Add a new train (Admin only)
- GET /trains/availability - Get train availabilities between source and destination

### Bookings

- POST /bookings - Book a seat on a train
- GET /bookings/:id - Get specific booking details

## Authentication

- User authentication is done using JWT tokens.
- Admin endpoints are protected with an API key.

## Concurrency Handling

This API uses Prisma transactions with Serializable isolation level to handle concurrent booking attempts. If multiple users try to book seats simultaneously, the system ensures that overbooking doesn't occur.

## Error Handling

The API returns appropriate error messages and status codes for various scenarios, such as invalid credentials, unauthorized access, or booking failures.

## Assumptions

- The system assumes that each train has a fixed number of seats and doesn't handle different classes of seats.
- Cancellations are not implemented in this version.
- The API doesn't handle complex scenarios like intermediate stops or multi-leg journeys.
