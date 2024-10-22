"use client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { faNewspaper, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { db } from "../../../../utils/firebaseConfig";

export default function EditArticle() {
  const router = useRouter();
  const { user, loading, setLoading } = useAuth();
  const { articleId } = useParams();

  const [articleData, setArticleData] = useState({
    title: '',
    description: '',
    image: '',
    tags: [],
  });
  
  const [inputTag, setInputTag] = useState('');
  const [articleImg, setArticleImg] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

 
  const fetchArticleData = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "userArticles", articleId);
      const docSnap = await getDoc(docRef);
      setLoading(false);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setArticleData(data);
        setPreviewImage(data.articleImg); 
      } else {
        toast.error(`Article not found`, { theme: "dark" });
      }
    } catch (err) {
      setLoading(false);
      console.error(err.message);
      toast.error(`Failed to fetch Article`, { theme: "dark" });
    }
  };

  console.log(articleData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && inputTag.trim() !== '') {
      e.preventDefault();
      if (!articleData.tags.includes(inputTag.trim())) {
        setArticleData((prev) => ({
          ...prev,
          tags: [...prev.tags, inputTag.trim()],
        }));
      }
      setInputTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setArticleData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setArticleImg(file); 
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!articleData.title || !articleData.description) {
      toast.error("Title and description are required", { theme: "dark" });
      return;
    }

    try {
      setLoading(true);
      const articleRef = doc(db, "userArticles", articleId);
      await updateDoc(articleRef, { 
        title: articleData.title,
        description: articleData.description,
        tags: articleData.tags,
        publishedAt: new Date().toISOString(),
        status: "Pending",
       }, { merge: true });

      setLoading(false);
      toast.success("Updated Article Successfully!! 🎉", { theme: "dark" });
      router.push("/myArticles");
    } catch (err) {
      setLoading(false);
      console.error(err.message);
      toast.error(`Failed to update article! Try again later`, { theme: "dark" });
    }
  };

  useEffect(() => {
    if (user) {
      fetchArticleData();
    } else {
      toast.error("You must be registered to edit an article!", { theme: "dark" });
      router.push("/");
    }
  }, [user, articleId]);

  return (
    <>
      <div className="new-Article-wrapper py-8">
        <div className="container mx-auto max-w-2xl px-4">
          <header className="bg-emerald-400 text-center mx-auto py-4 mb-8 mt-8">
        <h2 className="inline-block text-center mx-auto max-w-fit text-3xl py-2 font-bold">
        Edit Article
        </h2>
      </header>
          <form className="space-y-6" onSubmit={handleUpdate}>
            {/* Article Title */}
            <div>
              <label htmlFor="articleTitle" className="block text-sm font-medium text-gray-700">Article Title</label>
              <input
                type="text"
                id="articleTitle"
                name="title"
                placeholder="The Uncanny Encounter"
                value={articleData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Article Description */}
            <div>
              <label htmlFor="articleDescription" className="block text-sm font-medium text-gray-700">Body</label>
              <ReactQuill
                theme="snow"
                value={articleData.description}
                onChange={(content) => setArticleData((prev) => ({ ...prev, description: content }))}
                className="mt-1 min-h-[300px] max-h-[600px] overflow-y-auto"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label htmlFor="articleTags" className="block text-sm font-medium text-gray-700">Tags (press Enter to add)</label>
              <input
                type="text"
                id="articleTags"
                placeholder="Enter tags..."
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyPress={handleTagInput}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {articleData.tags.length > 0 && (
              <div className="tags mt-2">
                {articleData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-red-600 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label htmlFor="articleImage" className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                id="articleImage"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>

            {/* Image Preview */}
            {previewImage && (
              <div className="mt-3 text-center">
                <img src={previewImage} alt="Uploaded" className="w-full object-cover rounded-md" />
              </div>
            )}

            <button
              type="submit"
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spinPulse />
              ) : (
                "Update"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
