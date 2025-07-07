@echo off
echo Starting MedicImage Backend Server (FastAPI)...

echo Starting FastAPI server with uvicorn...
uvicorn app:app --host 0.0.0.0 --port 5000 --reload

pause 