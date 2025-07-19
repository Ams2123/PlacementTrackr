#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting build process ---"

# 1. Install system dependencies using yum
echo "--- Installing system dependencies (tesseract, poppler) ---"
# Update yum and enable the EPEL repository which contains tesseract
yum update -y
# Install the 'epel-release' package to configure the repository
yum install -y epel-release

# Now install tesseract and poppler-utils from the enabled repository
yum install -y tesseract poppler-utils

# 2. Install Python dependencies
echo "--- Installing Python dependencies from requirements.txt ---"
pip install -r requirements.txt

echo "--- Build script finished successfully! ---"
