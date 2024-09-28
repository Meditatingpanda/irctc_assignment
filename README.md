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

## Roles

There are two user roles in the system:

- `USER`: Regular user with limited access
- `ADMIN`: Administrator with full access to all endpoints

## Authentication

### Register a new user

```http
POST /auth/register
```

| Parameter   | Type     | Description                                      |
| :---------- | :------- | :----------------------------------------------- |
| `username`  | `string` | **Required**. Username for the new user          |
| `password`  | `string` | **Required**. Password for the new user          |
| `role`      | `string` | **Required**. User role (ADMIN or USER)          |
| `x-api-key` | `string` | **Required for ADMIN**. API key for admin access |

Note: To register an ADMIN user, you must provide a valid `x-api-key` in the request headers.

### Login

```http
POST /auth/login
```

| Parameter  | Type     | Description                        |
| :--------- | :------- | :--------------------------------- |
| `username` | `string` | **Required**. Username of the user |
| `password` | `string` | **Required**. Password of the user |

## Trains

### Add a new train (Admin only)

```http
POST /trains/add-trains
```

| Parameter       | Type     | Description                                      |
| :-------------- | :------- | :----------------------------------------------- |
| `name`          | `string` | **Required**. Name of the train                  |
| `source`        | `string` | **Required**. Source station of the train        |
| `destination`   | `string` | **Required**. Destination station of the train   |
| `totalSeats`    | `number` | **Required**. Total number of seats in the train |
| `Authorization` | `string` | **Required**. JWT token for authentication       |

### Update a train (Admin only)

```http
POST /trains/update-train/${id}
```

| Parameter       | Type     | Description                                 |
| :-------------- | :------- | :------------------------------------------ |
| `id`            | `number` | **Required**. ID of the train to update     |
| `name`          | `string` | **Required**. Updated name of the train     |
| `source`        | `string` | **Required**. Updated source station        |
| `destination`   | `string` | **Required**. Updated destination station   |
| `totalSeats`    | `number` | **Required**. Updated total number of seats |
| `Authorization` | `string` | **Required**. JWT token for authentication  |

### Get train availabilities

```http
GET /trains/availability
```

| Parameter       | Type     | Description                                    |
| :-------------- | :------- | :--------------------------------------------- |
| `source`        | `string` | **Required**. Source station to search from    |
| `destination`   | `string` | **Required**. Destination station to search to |
| `Authorization` | `string` | **Required**. JWT token for authentication     |

## Bookings

### Book a seat

```http
POST /bookings
```

| Parameter       | Type     | Description                                     |
| :-------------- | :------- | :---------------------------------------------- |
| `trainId`       | `number` | **Required**. ID of the train to book a seat on |
| `Authorization` | `string` | **Required**. JWT token for authentication      |

### Get booking details

```http
GET /bookings/${id}
```

| Parameter       | Type     | Description                                |
| :-------------- | :------- | :----------------------------------------- |
| `id`            | `number` | **Required**. ID of the booking to fetch   |
| `Authorization` | `string` | **Required**. JWT token for authentication |

## Admin-only Routes

The following routes are accessible only to users with the ADMIN role:

1. Add a new train: `POST /trains/add-trains`
2. Update a train: `POST /trains/update-train/${id}`

All other routes are accessible to both USER and ADMIN roles, but the data returned may be filtered based on the user's role and permissions.

## Authentication Notes

- All routes except `/auth/register` and `/auth/login` require a valid JWT token in the `Authorization` header.
- The JWT token should be included in the `Authorization` header as a Bearer token: `Authorization: Bearer <your_jwt_token>`
- Admin-only routes will check for both a valid JWT token and the ADMIN role before granting access.

## Error Handling

- If an unauthorized user attempts to access an admin-only route, the API will return a 403 Forbidden error.
- Invalid or expired JWT tokens will result in a 401 Unauthorized error.
- Other errors (e.g., not found, bad request) will return appropriate HTTP status codes and error messages.

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
