import streamlit as st
import os
from PIL import Image
import google.generativeai as genai

# Configure Google Generative AI
genai.configure(api_key="AIzaSyDU6r_QdEfmKCgN7DNS_NPJsSy1smMR2v8")
model = genai.GenerativeModel('gemini-1.5-flash')
lang_model = genai.GenerativeModel('gemini-pro')

# Set page configuration
st.set_page_config(
    page_title="MED-O-PRESCRIPTION",
    page_icon="🩺",  
)

# Define functions
def get_gemini_response(input, image, prompt):
    response = model.generate_content([input, image[0], prompt])
    return response.text

def input_image_setup(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.getvalue()
        image_parts = [{
            "mime_type": uploaded_file.type,
            "data": bytes_data
        }]
        return image_parts
    else:
        raise FileNotFoundError("No file uploaded")

# App layout
st.title("MED-O-PRESCRIPTION")
st.header("Virtual Pharmacist")

# Introduction Section
st.markdown("""
Welcome to **MED-O-PRESCRIPTION**, an AI-powered tool that helps you understand your medical prescriptions. 
This utility is a part of the larger **MED-O-NEXT** platform, a one-step solution to all your medical needs. 
Whether you want to know more about the medicines prescribed to you or just need clarity on a prescription, MED-O-PRESCRIPTION has got you covered!
""")

# Instructions Section
st.subheader("How to Use:")
st.markdown("""
1. **Upload Your Prescription:** Click on the "Upload your prescription..." button and select the image of your handwritten medical prescription (supported formats: JPG, JPEG, PNG).
2. **Ask a Question:** Type in any question you have about the prescription in the text input box.
3. **Submit:** Click the "Tell me about the prescription" button to get detailed information about the prescription and the medicines listed.
4. **Review Results:** The AI will provide a detailed response, including the medicine names, their uses, side effects, and safety advice.
""")

# File uploader and text input
question = st.text_input("Question about prescription: ", key="input")
uploaded_file = st.file_uploader("Upload your prescription...", type=['jpg', 'jpeg', 'png'])

# Display uploaded image
if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Prescription", use_column_width=True)

# Prompts for AI
input_prompt = """
You are an expert in understanding handwritten medical prescriptions. 
We will upload an image as a medical prescription and you will have to answer any questions based on the uploaded prescription image.
"""

medicine_prompt = """
You are an expert in understanding handwritten medical prescriptions and act as a pharmacist. 
We will upload an image as a medical prescription and you will have to extract all the medicine names based on the uploaded prescription image and 
report the medicine name under the heading "Medicine Name:", its uses in 1 sentence under the heading "Uses:", any 3 side effects under the heading "Side Effects:",
and safety advice under the heading "Safety Advice:". Group the Uses, Side Effects, and Safety Advice section under Medicine Name.
Each point under the heading should be in a bullet format.
"""

# Submit button and response handling
submit = st.button("Tell me about the prescription")
if submit:
    if uploaded_file is not None:
        image_data = input_image_setup(uploaded_file)
        response = get_gemini_response(input_prompt, image_data, question)
        medicine_name = get_gemini_response(medicine_prompt, image_data, "")
        st.subheader("The Response is:")
        st.write(response)
        st.subheader("The Medicine is:")
        st.write(medicine_name)
    else:
        st.error("Please upload a prescription image.")

# Footer: About MED-O-NEXT
st.markdown("---")
st.markdown("""
### About MED-O-NEXT
**MED-O-PRESCRIPTION** is a utility of **MED-O-NEXT**, your one-step solution to all medical needs. 
From AI-powered prescription reading to health advice and medicine delivery, MED-O-NEXT is dedicated to making healthcare accessible, convenient, and comprehensive.
""")
