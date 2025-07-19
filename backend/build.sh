#!/usr/bin/env bash

# Exit on error
set -o errexit

# Install Tesseract and Poppler
apt-get update
apt-get install -y tesseract-ocr poppler-utils

# Install Python deps
pip install -r requirements.txt
