// import { db } from '../../../utils/firebaseConfig';
// import {collection, getDocs, setDoc } from 'firebase/firestore';

// export async function GET() {
  
//   try {

//     const articlesSnapshot = await getDocs(collection(db, "userArticles"));
//     const articles = articlesSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return new Response(JSON.stringify(articles), { status: 200 }); //media page- to be verified by admin
//   } catch (error) {
//     console.error("Error fetching articles: ", error.message); 
//     return new Response(JSON.stringify({ error: 'Failed to fetch news' }), { status: 500 });
//   }

// }


