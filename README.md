# Todo App

A simple, lightweight todo application built with Node.js, Express, and EJS. Perfect for testing deployments on AWS or other cloud platforms.

## Features

- ✅ Add, complete, and delete todos
- 📊 Real-time statistics (total, completed, pending)
- 🎨 Clean and modern UI
- 📱 Fully responsive design
- 🚀 No database required (in-memory storage)
- 🐳 Docker ready for cloud deployment

## Project Structure

```
.
├── server.js           # Express server and API endpoints
├── package.json        # Node.js dependencies
├── Dockerfile          # Docker configuration
├── .dockerignore        # Files to exclude from Docker build
├── views/
│   └── index.ejs       # Main EJS template
└── public/
    ├── style.css       # Styling
    └── script.js       # Client-side logic
```

## Prerequisites

- Node.js 14+ (or Docker)
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /` - Render main page
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo (toggle completion)
- `DELETE /api/todos/:id` - Delete a specific todo
- `DELETE /api/todos` - Clear all todos

## Docker Deployment

### Build the Docker image:
```bash
docker build -t todo-app .
```

### Run the container:
```bash
docker run -p 3000:3000 todo-app
```

The app will be available at `http://localhost:3000`

### AWS ECS Deployment

1. Push image to Amazon ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [YOUR_AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com

docker tag todo-app:latest [YOUR_AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/todo-app:latest

docker push [YOUR_AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/todo-app:latest
```

2. Create an ECS task definition and service pointing to your ECR image

3. Deploy to ECS cluster

## Environment Variables

- `PORT` - Server port (default: 3000)

## Notes

- Todos are stored in-memory, so they will be lost when the server restarts
- This is perfect for testing and development, not for production with persistent data
- For production use, add a database like MongoDB or PostgreSQL

## License

ISC
