import fitz  # PyMuPDF

def extract_pdf_text(file):
    """
    Extracts text from an uploaded PDF file.

    Args:
        file: File-like object (from Flask request.files)

    Returns:
        str: Full text of the PDF.
    """
    try:
        doc = fitz.open(stream=file.read(), filetype="pdf")
        text = "".join([page.get_text() for page in doc])
        doc.close()
        return text
    except Exception as e:
        print("PDF extraction error:", e)
        return ""
