# main.py
import re
import io
import spacy
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image

# --- NEW: Import the spaCy model directly as a package ---
# This is more reliable in serverless environments.
import en_core_web_sm

# --- API SETUP ---
app = FastAPI(
    title="Resume Parser API",
    description="An API to extract structured information from resume files (PDFs or Images) using OCR and NLP.",
    version="2.0.0",
)

# --- CORS MIDDLEWARE ---
# This allows your frontend (e.g., http://localhost:8080) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- MODEL LOADING ---
# --- NEW: Load the model from the imported package ---
try:
    nlp = en_core_web_sm.load()
except Exception as e:
    print(f"FATAL: Could not load spaCy model from package. Error: {e}")
    nlp = None


# --- Pydantic Models for Structured Output ---
class ResumeData(BaseModel):
    name: Optional[str] = Field(None, description="The full name of the candidate.")
    skills: List[str] = Field([], description="A list of extracted skills.")
    experience: List[str] = Field([], description="A list of paragraphs describing work experience.")
    education: List[str] = Field([], description="A list of paragraphs describing academic history.")
    projects: List[str] = Field([], description="A list of paragraphs describing projects.")
    achievements: List[str] = Field([], description="A list of paragraphs describing achievements or awards.")
    raw_text: str = Field(..., description="The full raw text extracted from the resume.")

# --- HELPER FUNCTIONS ---
# (No changes to the helper functions below)

def extract_text_from_file(file_bytes: bytes, content_type: str) -> str:
    full_text = ""
    try:
        if content_type == "application/pdf":
            images = convert_from_bytes(file_bytes, dpi=300)
            for image in images:
                full_text += pytesseract.image_to_string(image) + "\n"
        elif content_type.startswith("image/"):
            image = Image.open(io.BytesIO(file_bytes))
            full_text = pytesseract.image_to_string(image)
        else:
            # Added support for DOCX by simply rejecting it with a clear message
            if "wordprocessingml" in content_type:
                 raise HTTPException(status_code=400, detail="DOCX files are not supported. Please upload a PDF or Image.")
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {content_type}")
    except Exception as e:
        # Pass along the specific exception message
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")
    return full_text

def parse_resume_text(text: str) -> ResumeData:
    name = None
    if nlp:
        # Limit the initial doc for name processing to the first 500 characters for efficiency
        doc = nlp(text[:500])
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                name = ent.text
                break
    if not name:
        for line in text.split('\n'):
            if line.strip():
                name = line.strip()
                break

    section_keywords = {
        "skills": ["skills", "technical skills", "proficiencies", "technologies"],
        "experience": ["experience", "work experience", "professional experience", "employment history", "internships"],
        "education": ["education", "academic background", "academic history"],
        "projects": ["projects", "personal projects", "academic projects"],
        "achievements": ["achievements", "awards", "honors", "accomplishments"],
    }
    keyword_to_section = {kw: key for key, kws in section_keywords.items() for kw in kws}
    sections = {key: "" for key in section_keywords}
    lines = text.split('\n')
    current_section = None
    for line in lines:
        line_lower = line.strip().lower()
        found_section = False
        for kw, section_name in keyword_to_section.items():
            if re.match(rf'\b{re.escape(kw)}\b', line_lower):
                current_section = section_name
                found_section = True
                break
        if found_section:
            continue
        if current_section:
            sections[current_section] += line + "\n"

    cleaned_sections = {}
    for section, content in sections.items():
        items = [item.strip() for item in content.split('\n') if item.strip()]
        final_items = []
        for item in items:
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
    if not nlp:
        # This is the error you were seeing. It triggers if `nlp` is None.
        raise HTTPException(status_code=503, detail="NLP model is not available. Server setup is incomplete.")
    
    file_bytes = await file.read()
    raw_text = extract_text_from_file(file_bytes, file.content_type)
    
    if not raw_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract any text from the document.")

    parsed_data = parse_resume_text(raw_text)
    return parsed_data
