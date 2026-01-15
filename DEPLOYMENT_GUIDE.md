# Production Deployment Guide

This guide covers deploying the Note-Taking Application to **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites

- GitHub repository with your code pushed
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas account with connection string

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend

1. Create a `render.yaml` file in the root of your backend directory (or use web service settings)
2. Ensure your `package.json` has proper scripts:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### Step 2: Create Render Web Service

1. Go to **Render Dashboard** → **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `note-app-backend` (or your choice)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select your preferred plan)

### Step 3: Add Environment Variables

In Render Dashboard, go to your service's **Environment** tab and add:

```
mongo_url=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
PORT=5001
```

**Note**: You'll get the `FRONTEND_URL` after deploying to Vercel.

### Step 4: Deploy

- Click **Deploy** in Render
- Wait for deployment to complete
- Once deployed, you'll get a URL like: `https://note-app-backend.onrender.com`
- **Save this URL** - you'll need it for the frontend

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. Ensure your `package.json` has proper scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

2. Update `.env.production` with your Render backend URL:
```
VITE_API_URL=https://note-app-backend.onrender.com/api
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to **Vercel Dashboard** → **Add New...** → **Project**
2. Import your GitHub repository
3. Select the **frontend** folder as the root directory
4. Configure:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables in **Project Settings** → **Environment Variables**:
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

6. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel
# Follow the prompts
```

### Step 3: Verify Deployment

Once deployed:
- Your frontend will be live at: `https://your-project.vercel.app`
- Update the backend's `FRONTEND_URL` environment variable in Render to this URL

---

## Part 3: Connect Backend and Frontend

### Update Backend CORS

1. Go to Render Dashboard → Your Backend Service → **Environment**
2. Update `FRONTEND_URL` to your Vercel URL: `https://your-project.vercel.app`
3. Redeploy the backend

The backend `index.js` automatically uses this for CORS:
```javascript
origin: NODE_ENV === "production" 
  ? process.env.FRONTEND_URL 
  : ["http://localhost:5173", "http://localhost:5175"]
```

---

## Health Checks

### Backend Health Check

Test if your backend is running:
```bash
curl https://your-render-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```

### Test API Endpoint

```bash
curl https://your-render-backend-url.onrender.com/api/notes
```

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Verify backend has been redeployed after updating `FRONTEND_URL`

### 502 Bad Gateway
- Check backend logs in Render: **Logs** tab
- Verify MongoDB connection string is correct
- Ensure `mongo_url` environment variable is set

### API Calls Return 404
- Check that your frontend's `VITE_API_URL` matches backend URL
- Verify frontend has been rebuilt and redeployed after updating API URL

### Cold Starts
- Render may put free tier services to sleep after inactivity
- Upgrade to Paid plan if you need always-on service

---

## Environment Variables Summary

### Backend (Render)
- `mongo_url`: MongoDB Atlas connection string
- `NODE_ENV`: Set to `production`
- `FRONTEND_URL`: Your Vercel frontend URL
- `PORT`: 5001 (Render will assign this)

### Frontend (Vercel)
- `VITE_API_URL`: Your Render backend URL + `/api`
  - Example: `https://note-app-backend.onrender.com/api`

---

## Testing Locally Before Deployment

```bash
# Backend
cd backend
NODE_ENV=production npm run dev

# Frontend (in another terminal)
cd frontend
npm run build
npm run preview
```

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

