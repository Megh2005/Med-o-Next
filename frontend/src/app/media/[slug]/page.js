// src/app/media/[slug]/page.js
// This page dynamically displays an individual article based on its slug (unique identifier).
import { db } from '../../../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function generateStaticParams() {
  const articlesCollection = collection(db, 'articles');
  const articleSnapshot = await getDoc(articlesCollection);
  const slugs = articleSnapshot.docs.map(doc => doc.id);

  return slugs.map(slug => ({ slug }));
}

export default async function ArticlePage({ params }) {
  const { slug } = params;
  const articleRef = doc(db, 'articles', slug);
  const articleDoc = await getDoc(articleRef);
  const article = articleDoc.data();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p>{article.content}</p>
      <p className="text-gray-500">By: {article.author}</p>
    </div>
  );
}
