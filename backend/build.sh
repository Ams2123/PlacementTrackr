#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting build process ---"

# 1. Install system dependencies
echo "--- Installing system dependencies (tesseract, poppler) ---"
sudo apt-get update
sudo apt-get install -y tesseract-ocr poppler-utils

# 2. Install Python dependencies
echo "--- Installing Python dependencies from requirements.txt ---"
pip install -r requirements.txt

# 3. Download the spaCy model
echo "--- Downloading spaCy model (en_core_web_sm) ---"
python -m spacy download en_core_web_sm

echo "--- Build script finished successfully! ---"