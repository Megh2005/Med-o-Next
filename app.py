import streamlit as st
from PIL import Image
import pytesseract

# Title and Description
st.title("Doctor's Prescription Reader")
st.write("Upload an image of a doctor's prescription, and this app will use OCR (Optical Character Recognition) to extract and display the text.")

# Image Upload
uploaded_file = st.file_uploader("Choose an image file", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    # Display the uploaded image
    image = Image.open(uploaded_file)
    st.image(image, caption='Uploaded Prescription', use_column_width=True)

    # OCR Process
    st.write("Processing the image...")
    text = pytesseract.image_to_string(image)

    # Display the extracted text
    st.write("Here is the text extracted from the image:")
    st.text_area("Extracted Text", text, height=200)

    # Download the extracted text as a .txt file
    st.write("You can download the extracted text as a .txt file:")
    st.download_button(
        label="Download Text",
        data=text,
        file_name="extracted_text.txt",
        mime="text/plain"
    )

# Footer
st.write("Note: This app uses Tesseract-OCR to recognize text in images. The accuracy of text recognition may vary depending on the quality of the image and handwriting.")
