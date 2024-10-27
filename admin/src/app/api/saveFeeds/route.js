import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { toast } from "react-toastify";

export async function GET() {
  const mentalHealthFeeds = [
          {
            "category": "mentalHealth",
            "title": "Understanding Depression and Its Treatment",
            "description": "A comprehensive guide to understanding depression and the available treatments to manage it.",
            "url": "https://www.who.int/news-room/fact-sheets/detail/depression",
            "imageUrl": "/path-to-image1.jpg"
          },
          {
            "category": "mentalHealth",
            "title": "Cognitive Behavioral Therapy: Effectiveness for Anxiety",
            "description": "How cognitive behavioral therapy (CBT) helps people manage anxiety effectively.",
            "url": "https://www.psychiatry.org/patients-families/psychotherapy",
            "imageUrl": "/path-to-image2.jpg"
          },
         
          {
            "category": "mentalHealth",
            "title": "Managing Anxiety Through Mindfulness Techniques",
            "description": "Explore how mindfulness meditation helps manage anxiety and promotes mental clarity.",
            "url": "https://www.mindful.org/how-to-practice-mindfulness/",
            "imageUrl": "/path-to-image13.jpg"
          },
          {
            "category": "mentalHealth",
            "title": "Post-Traumatic Stress Disorder (PTSD): Symptoms and Treatments",
            "description": "A guide to recognizing the signs of PTSD and available treatment options.",
            "url": "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd",
            "imageUrl": "/path-to-image14.jpg"
          },
          

          {
            "category": "mentalHealth",
            "title": "Seasonal Affective Disorder (SAD): How to Cope",
            "description": "Tips on recognizing and coping with seasonal affective disorder, a form of depression that occurs in winter.",
            "url": "https://www.nimh.nih.gov/health/publications/seasonal-affective-disorder",
            "imageUrl": "/path-to-image25.jpg"
          },
          {
            "category": "mentalHealth",
            "title": "Understanding Depression and Its Treatment",
            "description": "A comprehensive guide to understanding depression and the available treatments to manage it.",
            "url": "https://www.who.int/news-room/fact-sheets/detail/depression",
            "imageUrl": "/path-to-image1.jpg"
          },
          {
            "category": "mentalHealth",
            "title": "Cognitive Behavioral Therapy: Effectiveness for Anxiety",
            "description": "How cognitive behavioral therapy (CBT) helps people manage anxiety effectively.",
            "url": "https://www.psychiatry.org/patients-families/psychotherapy",
            "imageUrl": "/path-to-image2.jpg"
          },
      
  ];

  const cardiologyFeeds=[
    {
        "category": "cardiology",
        "title": "Understanding Heart Valve Diseases",
        "description": "An overview of the causes, symptoms, and treatment options for heart valve diseases.",
        "url": "https://www.mayoclinic.org/diseases-conditions/heart-valve-disease/symptoms-causes/syc-20353727",
        "imageUrl": "/path-to-image24.jpg"
      },
      {
        "category": "cardiology",
        "title": "The Link Between Hypertension and Heart Disease",
        "description": "How hypertension increases the risk of heart disease and stroke, and what can be done to manage it.",
        "url": "https://www.cdc.gov/bloodpressure/about.htm",
        "imageUrl": "/path-to-image23.jpg"
      },
      {
        "category": "cardiology",
        "title": "Managing Cholesterol Levels to Prevent Heart Disease",
        "description": "Understand the role of cholesterol in heart health and how to manage it effectively.",
        "url": "https://www.heart.org/en/health-topics/cholesterol",
        "imageUrl": "/path-to-image11.jpg"
      },
      {
        "category": "cardiology",
        "title": "Heart Attack Prevention: What You Need to Know",
        "description": "Learn about heart attack prevention strategies and the importance of early intervention.",
        "url": "https://www.cdc.gov/heartdisease/prevention.htm",
        "imageUrl": "/path-to-image12.jpg"
      },

  ]

  const yogaFeed=[
    {
        "category": "yoga",
        "title": "Chair Yoga for Office Workers",
        "description": "Simple yoga poses that can be done from a chair to relieve stress and improve posture during work.",
        "url": "https://www.yogajournal.com/poses/types/chair-yoga",
        "imageUrl": "/path-to-image21.jpg"
      },
      {
        "category": "yoga",
        "title": "Yoga for Weight Loss: Poses that Help Burn Calories",
        "description": "An exploration of yoga poses that promote weight loss and improve metabolic function.",
        "url": "https://www.medicalnewstoday.com/articles/yoga-for-weight-loss",
        "imageUrl": "/path-to-image22.jpg"
      },
      {
        "category": "yoga",
        "title": "Yoga for Stress Relief and Relaxation",
        "description": "A beginner’s guide to yoga poses that help in reducing stress and promoting relaxation.",
        "url": "https://www.yogajournal.com/poses/types/restorative",
        "imageUrl": "/path-to-image9.jpg"
      },
      {
        "category": "yoga",
        "title": "The Benefits of Daily Yoga Practice",
        "description": "Discover the physical and mental benefits of a consistent daily yoga practice.",
        "url": "https://www.hopkinsmedicine.org/health/wellness-and-prevention/the-benefits-of-yoga",
        "imageUrl": "/path-to-image10.jpg"
      },

  ]

  const fitness=[
    {
        "category": "fitness",
        "title": "Aerobic Exercise: What it is and Why it’s Important",
        "description": "The science behind aerobic exercise and its role in cardiovascular and metabolic health.",
        "url": "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/aerobic-exercise/art-20045541",
        "imageUrl": "/path-to-image15.jpg"
      },
      {
        "category": "fitness",
        "title": "High-Intensity Interval Training (HIIT) for Busy Schedules",
        "description": "How to incorporate short bursts of high-intensity workouts into a busy day for maximum results.",
        "url": "https://www.health.harvard.edu/blog/what-is-high-intensity-interval-training-hiit-2018012213085",
        "imageUrl": "/path-to-image16.jpg"
      },
      {
        "category": "fitness",
        "title": "The Benefits of Strength Training for All Ages",
        "description": "How strength training can improve muscle mass, bone density, and overall health.",
        "url": "https://www.cdc.gov/physicalactivity/basics/strength-training/index.htm",
        "imageUrl": "/path-to-image3.jpg"
      },
      {
        "category": "fitness",
        "title": "Fitness Routine for a Healthy Heart",
        "description": "A heart-healthy workout plan designed to keep your cardiovascular system strong.",
        "url": "https://www.heart.org/en/healthy-living/fitness",
        "imageUrl": "/path-to-image4.jpg"
      },
  ]

  const pediatrics=[
    {
        "category": "pediatrics",
        "title": "Recognizing Early Signs of Autism in Children",
        "description": "How parents can identify early developmental signs of autism in children.",
        "url": "https://www.cdc.gov/ncbddd/autism/facts.html",
        "imageUrl": "/path-to-image17.jpg"
      },
      {
        "category": "pediatrics",
        "title": "Proper Nutrition for Healthy Growth in Children",
        "description": "A guide to essential nutrients and balanced meals for growing children.",
        "url": "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
        "imageUrl": "/path-to-image18.jpg"
      },
      {
        "category": "pediatrics",
        "title": "Immunization Schedule for Children",
        "description": "Stay up to date with your child’s immunizations according to global health recommendations.",
        "url": "https://www.who.int/immunization/policy/immunization_schedules/en/",
        "imageUrl": "/path-to-image5.jpg"
      },
      {
        "category": "pediatrics",
        "title": "Preventing Childhood Obesity: Guidelines for Parents",
        "description": "Understanding the root causes of childhood obesity and the steps parents can take to prevent it.",
        "url": "https://www.cdc.gov/obesity/childhood/causes.html",
        "imageUrl": "/path-to-image6.jpg"
      },

  ]

  const nutrition=[
    {
        "category": "nutrition",
        "title": "The Importance of Hydration for Overall Health",
        "description": "Why staying hydrated is crucial for body functions, from digestion to cognition.",
        "url": "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256",
        "imageUrl": "/path-to-image19.jpg"
      },
      {
        "category": "nutrition",
        "title": "Best Foods for Gut Health",
        "description": "Discover the top foods that promote a healthy gut microbiome.",
        "url": "https://www.healthline.com/nutrition/best-foods-for-gut-health",
        "imageUrl": "/path-to-image20.jpg"
      },
      {
        "category": "nutrition",
        "title": "The Role of Vitamin D in Bone Health",
        "description": "How Vitamin D plays a crucial role in bone strength and the prevention of osteoporosis.",
        "url": "https://www.healthline.com/nutrition/vitamin-d-and-calcium",
        "imageUrl": "/path-to-image7.jpg"
      },
      {
        "category": "nutrition",
        "title": "Superfoods for a Healthy Lifestyle",
        "description": "Explore the top superfoods to incorporate into your diet for a healthy lifestyle.",
        "url": "https://www.health.harvard.edu/staying-healthy/what-are-superfoods",
        "imageUrl": "/path-to-image8.jpg"
      },

  ]

  const balancedDiet = [
    {
        "category": "balancedDiet",
        "title": "The Fundamentals of a Balanced Diet",
        "description": "Learn the key principles of a balanced diet and how to achieve it for optimal health.",
        "url": "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
        "imageUrl": "/path-to-image1.jpg"
    },
    {
        "category": "balancedDiet",
        "title": "A Balanced Diet: Why It's Important for Your Health",
        "description": "Understand why balancing macronutrients and micronutrients is essential for maintaining health.",
        "url": "https://www.healthline.com/nutrition/balanced-diet",
        "imageUrl": "/path-to-image2.jpg"
    },
    {
        "category": "balancedDiet",
        "title": "The Benefits of Eating a Balanced Diet",
        "description": "Explore the benefits of eating a variety of foods that provide all essential nutrients.",
        "url": "https://www.hsph.harvard.edu/nutritionsource/healthy-eating-plate/",
        "imageUrl": "/path-to-image3.jpg"
    },
    {
        "category": "balancedDiet",
        "title": "What Is a Balanced Diet and How To Achieve It",
        "description": "Learn what a balanced diet entails and tips for meal planning that ensures nutrient diversity.",
        "url": "https://www.bbcgoodfood.com/howto/guide/balanced-diet",
        "imageUrl": "/path-to-image4.jpg"
    },
    {
        "category": "balancedDiet",
        "title": "Balanced Diet: Definition, Components, and Health Benefits",
        "description": "A comprehensive guide to understanding the components of a balanced diet and its health benefits.",
        "url": "https://www.webmd.com/diet/ss/slideshow-balanced-diet",
        "imageUrl": "/path-to-image5.jpg"
    }
];


   

  try {
    await setDoc(doc(db, "healthFeeds", "balancedDiet"), {
      feeds: balancedDiet,
    });
    console.log("Saved 1!");
    return new Response(JSON.stringify({message: "Articles Saved to Db"}), { status: 200 });
  } catch (error) {
    toast.error("Error saving health feeds:");
    return new Response(JSON.stringify({ error: 'Failed to save feeds' }), { status: 400 });
  }
};


