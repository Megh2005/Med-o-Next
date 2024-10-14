"use client";
import { db } from "../../utils/firebaseConfig";
import { addDoc, collection, getDocs, setDoc } from "firebase/firestore";

export async function dbArticles() {
  const apiKey = process.env.NEXT_PUBLIC_MEDIASTACK_API;
  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&categories=health,-sports&languages=en,-de&limit=50`;

  try {
    // const response = await axios.get(url);
    // const newsData = response.data.data;

    // const addData=await newsData.map(async(article) =>{
    //   await addDoc(collection(db, "articles"), {
    //     title: article.title,
    //     description: article.description,
    //     category: "health",
    //     image: article.image,
    //     url: article.url,
    //     publishedAt: (article.published_at)?.split("T")[0],
    //   })
    // })

    // await Promise.all(addData);

    // console.log("Articles stored in Firestore successfully.");

    const articlesRef = collection(db, "articles");
    const querySnapshot = await getDocs(articlesRef);

    const articles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return articles;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}
