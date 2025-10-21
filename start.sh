#!/bin/bash

echo "========================================"
echo "Presentatie Vertaal Applicatie"
echo "========================================"
echo ""

echo "Starten van Backend Server..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

echo "Wachten 3 seconden..."
sleep 3

echo "Starten van Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Servers zijn gestart!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "========================================"
echo ""
echo "Druk op Ctrl+C om te stoppen..."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
