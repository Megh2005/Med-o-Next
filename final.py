import streamlit as st
import os
from PIL import Image
import google.generativeai as genai
from googletrans import Translator

# Configure Google Generative AI with API key from environment variable
api_key = os.getenv("API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    st.error("API_KEY environment variable is not set.")

model = genai.GenerativeModel('gemini-1.5-flash')

# Set page configuration
st.set_page_config(
    page_title="MED-O-LENS 🔎",
    page_icon="🩺",
)

# Define functions
def get_gemini_response(input, image):
    response = model.generate_content([input, image[0]])
    return response.text

def input_image_setup(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.getvalue()
        image_parts = [{
            "mime_type": uploaded_file.type,
            "data": bytes_data
        }]
        return image_parts
    return None

# Initialize the translator
translator = Translator()

# Sidebar logo and "About Med-O-Lens"
team_logo = Image.open("logo.jpg")  # Replace with the actual path to your logo
st.sidebar.image(team_logo, caption="Team TECH JANTA PARTY", use_column_width=True)

st.sidebar.title("About Med-O-Lens")
st.sidebar.markdown("""
**MED-O-LENS** is an AI-powered utility that analyzes handwritten medical prescriptions to help users understand their medications.  
It's a part of the broader **MED-O-NEXT** platform, designed to integrate technology into healthcare services for a seamless experience.  
With MED-O-LENS, you can extract essential details like medicine names, uses, side effects, and safety advice, all with the help of AI.
""")

# Developers Section
st.sidebar.markdown("---")
st.sidebar.title("Developers")
st.sidebar.markdown("""
We are **TECH JANTA PARTY (TJP)**, a team of developers from Heritage Institute of Technology.  
Feel free to reach out to us for any inquiries or collaborations:
- **Email**: techjantaparty@gmail.com  
- **Phone**: +91 12345 67890
""")

# Main App Layout
st.title("MED-O-LENS 🔎")
st.header("Virtual Pharmacist")

# Introduction Section
st.markdown("""
Welcome to **MED-O-LENS**, an AI-powered tool that helps you understand your medical prescriptions.  
This utility is part of the larger **MED-O-NEXT** platform, offering a comprehensive suite of medical services.
""")

# Instructions Section
st.subheader("How to Use:")
st.markdown("""
1. **Upload Your Prescription:** Click on the "Upload your prescription..." button and select the image of your handwritten medical prescription (supported formats: JPG, JPEG, PNG).
2. **Submit:** Click the "Tell me about the prescription" button to get detailed information about the prescription and the medicines listed.
3. **Review Results:** The AI will provide a detailed response, including the medicine names, their uses, side effects, and safety advice.
""")

# File uploader
uploaded_file = st.file_uploader("Upload your prescription...", type=['jpg', 'jpeg', 'png'])

# Display uploaded image
if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Prescription", use_column_width=True)

# Prompts for AI
medicine_prompt = """
You are an expert in understanding handwritten medical prescriptions and act as a pharmacist. 
We will upload an image as a medical prescription, and you will have to extract all the medicine names based on the uploaded prescription image and 
report the medicine name under the heading "Medicine Name:", its uses in 1 sentence under the heading "Uses:" in a new line, any 3 side effects under the heading "Side Effects:" in a new line,
and safety advice under the heading "Safety Advice:" in a new line. Group the Uses, Side Effects, and Safety Advice section under Medicine Name.
Each point under the heading should be in a bullet format.
"""

# Translation Feature
st.subheader("Translation Settings")
st.markdown("If you'd like to translate the response into another language, choose a target language below:")
target_language = st.selectbox("Select target language:", ["None", "en", "es", "fr", "de", "zh-cn","hi","ja","ko","pt","ru","bn","bh","gu","ks","ml","ko","mr","ne","or","pa","sa","ta","te"])

# Submit button and response handling
submit = st.button("Tell me about the prescription")
if submit:
    if uploaded_file is not None:
        image_data = input_image_setup(uploaded_file)
        # Directly ask for the medicine information based on the image
        medicine_name = get_gemini_response(medicine_prompt, image_data)
        st.subheader("The Medicine is:")
        st.write(medicine_name)

        # Handle translation
        if target_language != "None":
            translation = translator.translate(medicine_name, dest=target_language)
            st.subheader(f"Translated to {target_language.upper()}:")
            st.write(translation.text)
    else:
        st.error("Please upload a prescription image.")
