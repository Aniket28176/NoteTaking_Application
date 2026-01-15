# Note-Taking Application

A full-stack MERN application for creating, editing, and managing notes with MongoDB backend and React frontend.

## Features

- Create, read, update, and delete notes
- Rich note interface with descriptions
- Responsive design with Tailwind CSS
- RESTful API backend
- Secure MongoDB storage

## Project Structure

```
NoteTaking_Application/
├── backend/              # Express.js API server
│   ├── config/          # Database configuration
│   ├── controllers/      # Route handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── index.js         # Server entry point
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app component
│   └── vite.config.js   # Vite configuration
└── DEPLOYMENT_GUIDE.md  # Production deployment instructions
```

## Quick Start - Development

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB connection string
npm run dev
```

Backend runs on: `http://localhost:5001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Available Scripts

### Backend

- `npm run dev` - Start server with auto-reload (nodemon)
- `npm start` - Start server
- `npm run prod` - Start in production mode

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

### Backend (.env)

```
mongo_url=your_mongodb_connection_string
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

See [backend/.env.example](backend/.env.example) for template.

### Frontend (.env.production)

```
VITE_API_URL=https://your-backend-url/api
```

See [frontend/.env.example](frontend/.env.example) for template.

## API Endpoints

### Notes API

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Health Check

- `GET /health` - Server health check

## Production Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to:
- **Render** (Backend)
- **Vercel** (Frontend)

### Quick Deployment Summary

1. **Backend** → Deploy to Render with MongoDB connection string
2. **Frontend** → Deploy to Vercel with backend API URL
3. **Connect** → Update CORS settings in backend with Vercel URL

## Troubleshooting

### CORS Errors
Ensure backend `FRONTEND_URL` matches your frontend's deployed URL.

### API Connection Failed
Check that both services are deployed and the API URL in frontend matches backend's deployed URL.

### Database Connection Error
Verify MongoDB connection string in backend `.env` file.

## Tech Stack

- **Backend**: Node.js, Express.js, Mongoose
- **Frontend**: React 19, Vite, React Router
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Requirements

- Node.js v18+
- MongoDB Atlas account
- npm or yarn package manager

## License

ISC

## Author

Aniket Ghosh

---

**Ready to deploy?** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions.
