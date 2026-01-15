# Backend Deployment Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account with connection string
- A hosting platform (Heroku, Railway, Render, AWS, etc.)

## Environment Setup

Your `.env` file should contain:
```bash
mongo_url="your_mongodb_connection_string"
PORT=5001
NODE_ENV=production
FRONTEND_URL="your_frontend_url"
```

Current configuration:
- **mongo_url**: MongoDB Atlas connection string
- **PORT**: Server port (default: 5001)
- **NODE_ENV**: Environment mode (development/production)
- **FRONTEND_URL**: Frontend URL for CORS configuration

## Local Testing

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode (simulates production environment)
npm run prod
```

## Health Check

Once deployed, verify your server is running:
```bash
curl https://your-backend-url/health
```

Response should be:
```json
{
  "status": "OK",
  "timestamp": "2026-01-15T..."
}
```

## API Endpoints

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Deployment Platforms

### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set mongo_url="your_mongodb_url"
heroku config:set NODE_ENV=production
```

### Railway / Render
1. Connect your GitHub repository
2. Set environment variables in the platform dashboard
3. Deploy

### Docker (Optional)

Create a `Dockerfile` in the backend directory:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

## Important Notes

- The server listens on `0.0.0.0:${PORT}` for better compatibility
- CORS is configured based on `NODE_ENV`
- Graceful shutdown on SIGTERM/SIGINT signals
- Connection pooling: 5-10 MongoDB connections
- Max request body size: 10MB
- Database retry logic: 5 attempts with 3-second intervals

## Monitoring

The backend logs:
- Request timestamps and methods
- Database connection status
- Errors and warnings
- Server startup confirmation

All logs include timestamps and status indicators (✓ for success, ✗ for errors, ⚠ for warnings)

## Security Considerations

- Keep `.env` file secure and never commit to version control
- Use environment-specific CORS origins
- MongoDB username/password should be in environment variables only
- In production, set `NODE_ENV=production`
