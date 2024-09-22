import streamlit as st
import os
from PIL import Image
import google.generativeai as genai

genai.configure(api_key="AIzaSyDU6r_QdEfmKCgN7DNS_NPJsSy1smMR2v8")
model = genai.GenerativeModel('gemini-1.5-flash')
lang_model = genai.GenerativeModel('gemini-pro')

def get_gemini_response(input,image,prompt):
    response = model.generate_content([input,image[0],prompt])
    return response.text

def input_image_setup(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.getvalue()
        image_parts = [{
            "mime_type":uploaded_file.type,
            "data": bytes_data
        }]
        return image_parts
    else:
        raise FileNotFoundError("No file uploaded")

st.set_page_config(page_title="Prescription reader")
st.header("Virtual Pharmacist")
question = st.text_input("question about prescription: ",key="input")
uploaded_file = st.file_uploader("Upload your prescription...",type=['jpg','jpeg','png'])
image = ""
if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image,caption="Uploaded prescription.", use_column_width=True)

submit = st.button("Tell me about the prescription")
input_prompt="""
You are an expert in understanding hand written medical prescription. 
we will upload a image as medical prescription and you will have to answer any questions based on the uploaded prescription image"""

medicine_prompt="""
You are an expert in understanding hand written medical prescription and act as a pharmacist. 
we will upload a image as medical prescription and you will have to extract all the medicine name based on the uploaded prescription image and 
report the medicine name under the heading "Medicine Name:", its uses in 1 sentence under the heading "Uses:", any 3 side effects under the heading "Side Effects:"
and safety advice under the heading "Safety Advice:". Group the Uses, Side Effects and Safety Advice section under Medicine Name.
Each points under the heading should be in a bullet format."""

if submit:
    image_data = input_image_setup(uploaded_file)
    response = get_gemini_response(input_prompt,image_data,question)
    medicine_name = get_gemini_response(medicine_prompt,image_data,"")
    st.subheader("The Response is:")
    st.write(response)
    st.subheader("The Medicine is:")
    st.write(medicine_name)