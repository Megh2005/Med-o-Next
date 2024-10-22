"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const ArticleContext = createContext();

export const useArticle = () => useContext(ArticleContext);

export const ArticleProvider = ({ children }) => {
    const router = useRouter();
  const[articleData, setArticleData]=useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(" ");
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });

    return () => unsubscribe();
  }, []);

  
  const submitArticle = async (articleData) => {
    const { uid } = auth.currentUser;
    await firestore.collection('userArticles').doc(uid).set({
      ...articleData,
      status: 'pending',
      submittedAt: new Date(),
    });
    console.log('Article submitted, waiting for moderation');
  };
  
  // // On moderator dashboard
  // const updateArticleStatus = async (articleId, status, comments) => {
  //   await firestore.collection('userArticles').doc(articleId).update({
  //     status,
  //     reviewComments: comments || '',
  //     verifiedAt: status === 'verified' ? new Date() : null,
  //   });
  //   console.log('Article status updated');
  // };
  

 

  return (
    <ArticleContext.Provider
      value={{loading}}
    >
      {children}
    </ArticleContext.Provider>
  );
};
