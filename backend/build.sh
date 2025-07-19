#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting build process ---"

# 1. Install system dependencies using yum
echo "--- Installing system dependencies (tesseract, poppler) ---"
yum update -y
yum install -y tesseract-ocr poppler-utils

# 2. Install Python dependencies
echo "--- Installing Python dependencies from requirements.txt ---"
pip install -r requirements.txt

echo "--- Build script finished successfully! ---"
