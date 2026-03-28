#!/bin/bash
echo "Starting Backend in the background..."
cd backend
npm install
echo "Seeding Database..."
node seed.js
node server.js &
BACKEND_PID=$!

echo "Starting Frontend in the background..."
cd ../frontend
npm install
npm run dev -- --host &
FRONTEND_PID=$!

echo "======================================"
echo "🚀 Tuition Management App is running! 🚀"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "======================================"
echo "Press [CTRL+C] to stop all processes."

cleanup() {
  echo ""
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

trap cleanup SIGINT SIGTERM

wait
