# Venu API Documentation

## Base URL
- **Production**: `https://venu-engine.onrender.com` (default)
- **Development**: `http://localhost:8000` (when NEXT_PUBLIC_API_URL is set)

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Rate Limiting
- **Authentication endpoints**: 5 requests per minute
- **Other endpoints**: 100 requests per minute

---

## 🔐 Authentication Endpoints

### POST `/api/v1/auth/signin`
**Description**: User login
**Content-Type**: `application/x-www-form-urlencoded`
**Body**:
```
username=user@example.com&password=password123&grant_type=password
```
**Response**:
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### POST `/api/v1/auth/signup`
**Description**: User registration
**Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123",
  "phone": "+1234567890"
}
```
**Response**:
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "access_token": "string"
}
```

### GET `/api/v1/auth/me`
**Description**: Get current user profile
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## 📅 Event Management Endpoints

### GET `/api/v1/events/`
**Description**: Get all events with optional filtering
**Query Parameters**:
- `category` (string): Filter by event category
- `search` (string): Search in event title and description
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of events per page (default: 10, max: 100)

**Response**:
```json
{
  "events": [
    {
      "id": "uuid",
      "title": "Tech Conference 2024",
      "description": "Annual technology conference featuring latest trends",
      "date": "2024-06-15T09:00:00Z",
      "location": "Convention Center, San Francisco",
      "category": "Technology",
      "creator_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "rsvp_count": 25
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### GET `/api/v1/events/{event_id}`
**Description**: Get a specific event by ID
**Response**:
```json
{
  "id": "uuid",
  "title": "Tech Conference 2024",
  "description": "Annual technology conference featuring latest trends",
  "date": "2024-06-15T09:00:00Z",
  "location": "Convention Center, San Francisco",
  "category": "Technology",
  "creator_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "rsvp_count": 25
}
```

### POST `/api/v1/events/`
**Description**: Create a new event
**Headers**: `Authorization: Bearer <token>`
**Body**:
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference featuring latest trends",
  "date": "2024-06-15T09:00:00Z",
  "location": "Convention Center, San Francisco",
  "category": "Technology"
}
```
**Response**:
```json
{
  "id": "uuid",
  "title": "Tech Conference 2024",
  "description": "Annual technology conference featuring latest trends",
  "date": "2024-06-15T09:00:00Z",
  "location": "Convention Center, San Francisco",
  "category": "Technology",
  "creator_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "rsvp_count": 0
}
```

### PUT `/api/v1/events/{event_id}`
**Description**: Update an existing event
**Headers**: `Authorization: Bearer <token>`
**Body**: Partial event data (same as POST body)
**Response**:
```json
{
  "id": "uuid",
  "title": "Updated Tech Conference 2024",
  "description": "Updated description for the conference",
  "date": "2024-06-20T09:00:00Z",
  "location": "New Convention Center, San Francisco",
  "category": "Technology",
  "creator_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "rsvp_count": 25
}
```

### DELETE `/api/v1/events/{event_id}`
**Description**: Delete an event
**Headers**: `Authorization: Bearer <token>`
**Response**: `204 No Content`

### GET `/api/v1/events/user`
**Description**: Get events created by the current user
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
[
  {
    "id": "uuid",
    "title": "My Event",
    "description": "Event description",
    "date": "2024-06-15T09:00:00Z",
    "location": "Event Location",
    "category": "Technology",
    "creator_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "rsvp_count": 5
  }
]
```

---

## 🎫 RSVP Management Endpoints

### POST `/api/v1/events/{event_id}/rsvp`
**Description**: RSVP to an event
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "message": "Successfully RSVP'd to event",
  "rsvp_id": "uuid"
}
```

---

## 🔧 API Client Usage

The project includes a pre-configured API client in `lib/api/client.ts`:

```typescript
import { apiClient } from '@/lib/api/client';

// Authentication
const loginData = await apiClient.login(email, password);
const userData = await apiClient.getCurrentUser();
const registerData = await apiClient.register(email, password, name, phone);

// Events
const events = await apiClient.getEvents({ category: 'Technology' });
const event = await apiClient.getEvent(eventId);
const newEvent = await apiClient.createEvent(eventData);
const updatedEvent = await apiClient.updateEvent(eventId, eventData);
const deletedEvent = await apiClient.deleteEvent(eventId);
const userEvents = await apiClient.getUserEvents();

// RSVPs
const rsvp = await apiClient.createRSVP(eventId);
```

---

## 🚨 Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `204`: No Content (for DELETE)
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "detail": [
    {
      "loc": ["field_name"],
      "msg": "error message",
      "type": "error_type"
    }
  ]
}
```

---

## 📊 System Endpoints

### GET `/`
**Description**: Get API information
**Response**:
```json
{
  "message": "Venu Engine API",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/health"
}
```

### GET `/health`
**Description**: Check API health status
**Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "production",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🔗 Additional Resources

- **Swagger Documentation**: https://venu-engine.onrender.com/docs
- **OpenAPI Spec**: https://venu-engine.onrender.com/openapi.json