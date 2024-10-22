import axios from 'axios';
import { db } from '../../../utils/firebaseConfig';
import {collection, getDocs, setDoc } from 'firebase/firestore';

export async function GET() {
  
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API;
  const url = `https://newsapi.org/v2/top-headlines?category=health&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const newsData =await response.data;
    console.log(newsData);

    const articlesRef = await setDoc(collection(db, "articles"), { newsData });
    const articlesSnapshot = await getDocs(articlesRef);
    const articles = articlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(newsData), { status: 200 });
  } catch (error) {
    console.error("Error fetching articles: ", error.message); 
    return new Response(JSON.stringify({ error: 'Failed to fetch news' }), { status: 500 });
  }

}


