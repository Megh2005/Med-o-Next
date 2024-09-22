import streamlit as st
import os
from google.generativeai import configure, GenerativeModel
from googletrans import Translator
import json

# Configure Google Generative AI
configure(api_key=os.getenv("API_KEY"))  # Use environment variable for the API key
model = GenerativeModel('gemini-1.5-flash')

# Initialize the translator
translator = Translator()

# Set page configuration
st.set_page_config(
    page_title="MED-O-COACH",
    page_icon="💪",
)

# Define functions
def call_gemini_api(prompt):
    try:
        response = model.generate_content([prompt])
        return response.text
    except Exception as e:
        st.error(f"Error with the Gemini API: {e}")
        return None

# Set custom CSS for better styling
st.markdown("""
    <style>
    .title {
        font-size: 2.5em;
        font-weight: bold;
        color: white;
    }
    .header {
        font-size: 1.5em;
        font-weight: bold;
        color: #333;
    }
    .footer {
        font-size: 1em;
        color: #666;
    }
    </style>
""", unsafe_allow_html=True)

# Sidebar layout
with st.sidebar:
    st.subheader("How to Use:")
    st.markdown("""
    1. **Enter Your Details:** Fill in your age, gender, weight, height, and any existing diseases.
    2. **Get Recommendations:** Click the "Get Recommendations" button to receive personalized health and wellness advice.
    3. **Review Recommendations:** The application will provide actionable insights to help you manage your health.
    """)
    
    st.subheader("About Us")
    st.markdown("""
    **MED-O-COACH** is a utility of our parent entity **MED-O-NEXT**, aimed at providing personalized health and wellness recommendations.
    
    We are **Tech Janta Party (TJP)** from **Heritage Institute of Technology, Kolkata**. If you have any questions, feel free to reach out to us at:
    - **Email:** techjantaparty@gmail.com
    """)

# App layout
st.title("MED-O-COACH")
st.markdown('<p class="title">Personalized Health and Wellness Recommendations</p>', unsafe_allow_html=True)

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
target_language = st.selectbox("Select target language:", ["None", "en", "hi", "bn", "ta", "te", "mr", "kn", "ml"])

# Submit button and response handling
submit = st.button("Get Recommendations")
if submit:
    result = call_gemini_api(input_prompt)
    
    if result:
        st.subheader("Recommendations:")
        st.write(result)

        # Handle translation
        if target_language != "None":
            try:
                translation = translator.translate(result, dest=target_language)
                st.subheader(f"Translated to {target_language.upper()}:")
                st.write(translation.text)
            except Exception as e:
                st.error(f"Translation failed: {e}")
    else:
        st.error("No recommendations generated. Please try again.")

# Footer
st.markdown("---")
st.markdown('<p class="footer">This application is designed to provide personalized health and wellness recommendations based on user input. Always consult with a healthcare professional for medical advice tailored to your individual needs.</p>', unsafe_allow_html=True)
