#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "--- Starting Render build process ---"

# 1. Install system dependencies using apt-get
# Render's native environment is Debian-based, so we use apt-get.
echo "--- Installing system dependencies (tesseract, poppler) ---"
apt-get update
apt-get install -y tesseract-ocr poppler-utils

# 2. Install Python dependencies
# Render can do this automatically, but running it here ensures it
# happens after the system dependencies are ready.
echo "--- Installing Python dependencies from requirements.txt ---"
pip install -r requirements.txt

echo "--- Build script finished successfully! ---"
