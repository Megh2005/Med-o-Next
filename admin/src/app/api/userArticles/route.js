import { db } from "../../../utils/firebase";
import { collection, getDocs, setDoc, query, where } from "firebase/firestore";

export async function GET() {
  try {


        const articlesRef = query(collection(db, "userArticles"), where("status", "==", "Pending"));
        const querySnapshot = await getDocs(articlesRef);
  
      if (querySnapshot.empty) {
        console.log("No pending articles found.");
        return new Response(JSON.stringify([]), { status: 200 });
      }
  
 
      const articles = querySnapshot.docs.map((doc) => ({
        id: doc.id,         
        ...doc.data(),   
      }));
      

    return new Response(JSON.stringify(articles), { status: 200 }); //articles page- to be verified by admin
  } catch (error) {
    console.error("Error fetching articles: ", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      status: 500,
    });
  }
}
