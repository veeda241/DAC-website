
import os
import sys

def extract_text(pdf_path):
    print(f"--- Processing: {pdf_path} ---")
    try:
        try:
            from pypdf import PdfReader
        except ImportError:
            try:
                from PyPDF2 import PdfReader
            except ImportError:
                print("Error: neither pypdf nor PyPDF2 installed.")
                return

        reader = PdfReader(pdf_path)
        if len(reader.pages) > 0:
            text = reader.pages[0].extract_text()
            print(f"Text Preview:\n{text[:500]}") # First 500 chars
        else:
            print("PDF has no pages.")
    except Exception as e:
        print(f"Error reading PDF: {e}")

files = [
    "DAC_Report.pdf",
    "Data_Analytics_Club_report.pdf",
    "DATA_ANALYTICS_CLUB.pdf",
    "Impact-ai-thon Initial Document.pdf",
    "Query Quest – DBMS & SQL Workshop and Quiz Competition (3).pdf"
]

for f in files:
    if os.path.exists(f):
        extract_text(f)
    else:
        print(f"File not found: {f}")
