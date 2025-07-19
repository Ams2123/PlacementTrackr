# main.py
# Import necessary libraries
import re
import io
import spacy
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image


try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Spacy model 'en_core_web_sm' not found. Please run 'python -m spacy download en_core_web_sm'")
    nlp = None

# --- API SETUP ---
app = FastAPI(
    title="Resume Parser API",
    description="An API to extract structured information from resume files (PDFs or Images) using OCR and NLP.",
    version="1.0.0",
)

# --- Pydantic Models for Structured Output ---
# This defines the structure of our JSON response
class ResumeData(BaseModel):
    name: Optional[str] = Field(None, description="The full name of the candidate.")
    skills: List[str] = Field([], description="A list of extracted skills.")
    experience: List[str] = Field([], description="A list of paragraphs describing work experience.")
    education: List[str] = Field([], description="A list of paragraphs describing academic history.")
    projects: List[str] = Field([], description="A list of paragraphs describing projects.")
    achievements: List[str] = Field([], description="A list of paragraphs describing achievements or awards.")
    raw_text: str = Field(..., description="The full raw text extracted from the resume.")

# --- HELPER FUNCTIONS ---

def extract_text_from_file(file_bytes: bytes, content_type: str) -> str:
    """
    Converts a file (PDF or image) into raw text using OCR.
    """
    full_text = ""
    try:
        if content_type == "application/pdf":
            # If it's a PDF, convert pages to images first
            images = convert_from_bytes(file_bytes, dpi=300)
            for image in images:
                full_text += pytesseract.image_to_string(image) + "\n"
        elif content_type.startswith("image/"):
            # If it's an image, process it directly
            image = Image.open(io.BytesIO(file_bytes))
            full_text = pytesseract.image_to_string(image)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {content_type}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")

    return full_text

def parse_resume_text(text: str) -> ResumeData:
    """
    Parses raw text to extract structured data.
    This function uses rule-based section splitting and NLP for name extraction.
    """
    # Use spaCy for Name Entity Recognition (NER) to find the person's name
    name = None
    if nlp:
        doc = nlp(text.split('\n')[0]) # Process the first line for the name
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                name = ent.text
                break
    
    # If spaCy fails, use a simple heuristic (first non-empty line)
    if not name:
        for line in text.split('\n'):
            if line.strip():
                name = line.strip()
                break

    # Define keywords to identify different sections of the resume
    # This list can be expanded for more variations
    section_keywords = {
        "skills": ["skills", "technical skills", "proficiencies", "technologies"],
        "experience": ["experience", "work experience", "professional experience", "employment history", "internships"],
        "education": ["education", "academic background", "academic history"],
        "projects": ["projects", "personal projects", "academic projects"],
        "achievements": ["achievements", "awards", "honors", "accomplishments"],
    }

    # Reverse mapping from keyword to section name
    keyword_to_section = {kw: key for key, kws in section_keywords.items() for kw in kws}
    
    # Initialize dictionary to hold section texts
    sections = {key: "" for key in section_keywords}
    lines = text.split('\n')
    current_section = None

    for line in lines:
        # Check if the line is a section header
        # We check for lines with 1-3 words in all caps or starting with a keyword
        line_lower = line.strip().lower()
        
        found_section = False
        for kw, section_name in keyword_to_section.items():
            if re.match(rf'\b{re.escape(kw)}\b', line_lower):
                current_section = section_name
                found_section = True
                break
        
        if found_section:
            continue # Skip the header line itself

        if current_section:
            sections[current_section] += line + "\n"

    # Clean up the extracted sections
    # Split by lines/bullets and remove empty entries
    cleaned_sections = {}
    for section, content in sections.items():
        # Split by newline, then filter out empty strings
        items = [item.strip() for item in content.split('\n') if item.strip()]
        # Further split by common bullet points
        final_items = []
        for item in items:
            # Use regex to split by bullets (*, -, •) and filter empty results
            sub_items = [sub.strip() for sub in re.split(r'\s*[\*\-•]\s*', item) if sub.strip()]
            final_items.extend(sub_items)
        cleaned_sections[section] = final_items

    return ResumeData(
        name=name,
        skills=cleaned_sections.get("skills", []),
        experience=cleaned_sections.get("experience", []),
        education=cleaned_sections.get("education", []),
        projects=cleaned_sections.get("projects", []),
        achievements=cleaned_sections.get("achievements", []),
        raw_text=text
    )


# --- API ENDPOINT ---
@app.post("/parse-resume/", response_model=ResumeData, tags=["Resume Parsing"])
async def parse_resume(file: UploadFile = File(...)):
    """
    Upload a resume file (PDF or Image) to extract its content.

    **How it works:**
    1.  The file is read into memory.
    2.  If it's a PDF, each page is converted to an image.
    3.  Tesseract OCR is used to extract raw text from the image(s).
    4.  The raw text is parsed to identify sections (Skills, Experience, etc.).
    5.  The structured data is returned as a JSON object.
    """
    # Ensure the spaCy model is available
    if not nlp:
        raise HTTPException(status_code=503, detail="NLP model is not available. Server setup is incomplete.")

    # Read the file content
    file_bytes = await file.read()
    
    # Extract raw text using OCR
    raw_text = extract_text_from_file(file_bytes, file.content_type)
    
    if not raw_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract any text from the document. The file might be empty, corrupted, or an image-only PDF without a text layer.")

    # Parse the text to get structured data
    parsed_data = parse_resume_text(raw_text)

    return parsed_data

# To run this app:
# 1. Save the code as main.py
# 2. Install dependencies: pip install "fastapi[all]" python-multipart pytesseract pdf2image spacy Pillow
# 3. Download the spaCy model: python -m spacy download en_core_web_sm
# 4. Install Tesseract OCR engine on your system.
# 5. Run the server: uvicorn main:app --reload
