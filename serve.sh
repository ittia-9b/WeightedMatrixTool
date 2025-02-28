#!/bin/bash

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Starting server with Python 3..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Starting server with Python..."
    python -m http.server 8000
elif command -v npx &> /dev/null; then
    echo "Starting server with Node.js..."
    npx http-server
else
    echo "Error: Neither Python nor Node.js is installed."
    echo "Please install either Python or Node.js to run the server."
    exit 1
fi 