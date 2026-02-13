import os
import glob
import sys
import shutil

# Try importing pypdf, provide helpful error if not installed
try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError:
        print("Error: neither pypdf nor PyPDF2 installed. This script requires 'pypdf'.")
        print("Please run: pip install -r requirements.txt")
        # We can implement a fallback if needed, but for now just exit or continue without PDF reading capability
        PdfReader = None

def extract_text_from_pdf(pdf_path, max_chars=500):
    if PdfReader is None:
        return "PDF reader library not available."
        
    print(f"--- Processing PDF: {pdf_path} ---")
    try:
        reader = PdfReader(pdf_path)
        if len(reader.pages) > 0:
            text = reader.pages[0].extract_text()
            preview = text[:max_chars] if text else "No text found on first page."
            print(f"Preview:\n{preview}...")
            return text
        else:
            print("PDF has no pages.")
            return ""
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        return ""

def process_reports(directory="."):
    """
    Process specific known report PDFs in the directory.
    """
    # Priority list from original read_pdfs.py
    priority_files = [
        "DAC_Report.pdf",
        "Data_Analytics_Club_report.pdf",
        "DATA_ANALYTICS_CLUB.pdf",
        "Impact-ai-thon Initial Document.pdf",
        "report event 2.pdf"
    ]
    
    # Also include any other PDF found via glob
    glob_files = glob.glob(os.path.join(directory, "*.pdf"))
    
    # Combined list, prioritizing priority_files
    files_to_process = list(set([os.path.join(directory, f) for f in priority_files] + glob_files))
    
    results = {}
    for f in files_to_process:
        if os.path.exists(f):
            results[f] = extract_text_from_pdf(f)
        else:
            # Check specifically for priority files if they are just filenames
            fname = os.path.basename(f)
            if fname in priority_files and not os.path.exists(f):
                 print(f"Priority file not found: {f}")

    return results

if __name__ == "__main__":
    process_reports()
