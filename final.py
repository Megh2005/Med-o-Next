import streamlit as st
import os
from google.generativeai import configure, GenerativeModel
from googletrans import Translator

# Configure Google Generative AI with the API key
configure(api_key=os.getenv("API_KEY"))
model = GenerativeModel('gemini-1.5-flash')

# Set Streamlit page configuration
st.set_page_config(
    page_title="Lifestyle Coach",
    page_icon="💪",
)

# Initialize the translator
translator = Translator()

# Function to call Gemini API
def call_gemini_api(prompt):
    response = model.generate_content([prompt])
    return response.text

# App layout
st.title("Lifestyle Coach")
st.header("Personalized Health and Wellness Recommendations")

# User input
age = st.number_input("Enter your age:", min_value=0, max_value=120)
gender = st.selectbox("Select your gender:", ["Male", "Female", "Other"])
disease = st.text_input("Enter any disease (or 'none' if not applicable):")
weight = st.number_input("Enter your weight (kg):", min_value=1.0)
height = st.number_input("Enter your height (cm):", min_value=50, max_value=250)

# Prompts for AI
input_prompt = f"""
You are a lifestyle and health coach. Based on the information provided, give specific recommendations for managing health and wellness for a {age}-year-old {gender} who has been diagnosed with {disease}. 
Focus on providing actionable advice on diet, physical activities, weight management, sleep, stress management, regular checkups, healthy habits, and lifestyle changes. 
Additionally, suggest preventive measures and lifestyle modifications that can help cope with the effects of {disease}.
"""

# Translation feature
st.subheader("Translation Settings")
st.markdown("If you'd like to translate the recommendations into another language, choose a target language below:")
target_language = st.selectbox("Select target language:", ["None", "en", "es", "fr", "de", "zh-cn","hi","ja","ko","pt","ru","bn","gu","mr","ta","te","ml"])

# Submit button and response handling
submit = st.button("Get Recommendations")
if submit:
    result = call_gemini_api(input_prompt)
    st.subheader("Recommendations:")
    st.write(result)

    # Handle translation
    if target_language != "None":
        translation = translator.translate(result, dest=target_language)
        st.subheader(f"Translated to {target_language.upper()}:")
        st.write(translation.text)

# Footer
st.markdown("---")
st.markdown("""
### About This Application
This Lifestyle Coach application is designed to provide personalized health and wellness recommendations based on user input. 
Always consult with a healthcare professional for medical advice tailored to your individual needs.
""")
