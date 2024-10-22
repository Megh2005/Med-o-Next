"use client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../../context/AuthContext";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import ArticleCard from "../../components/ArticleCard";

export default function CreateArticle() {
  const router = useRouter();
  const { user, token, loading, setLoading } = useAuth();

  const [articleImg, setArticleImg] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [preview, setPreview] = useState(false);
  const [previewArticleData, setPreviewArticleData] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setArticleImg(URL.createObjectURL(file));
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputTag.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputTag.trim())) {
        setTags([...tags, inputTag.trim()]);
      }
      setInputTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || description.trim() === "") {
      setError("⚠Title and body cannot be empty⚠");
      return;
    }

    const newArticle = {
      userId: user.uid,
      title,
      description,
      tags,
      author,
      articleImg,
      status: "Pending",
      publishedAt: new Date().toISOString(),
    };

    await setPreviewArticleData(newArticle);
    setPreview(true);
    toast.info("Your Article is ready to be published!🎉");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const articleRef = await addDoc(
        collection(db, "userArticles"),
        previewArticleData
      );
      setLoading(false);
      if (articleRef) {
        toast.success("Article Submitted for review by Moderators!!🎉", {
          theme: "dark",
        });
        router.push("/myArticles");
      }
    } catch (err) {
      setLoading(false);
      console.log(err.message);
      toast.error(`Failed to save Article! Try again later`, { theme: "dark" });
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("You must be registered to create a Article!", {
        theme: "dark",
      });
      router.push("/");
    }
  }, []);

  return (
      <div className="new-Article-wrapper py-8">
        <div className="container mx-auto max-w-2xl px-4">
        <header className="bg-emerald-400 text-center mx-auto py-4 mb-8 mt-8">
        <h2 className="inline-block text-center mx-auto max-w-fit text-3xl py-2 font-bold">
        Health Article Submission Form
        </h2>
      <p className=" font-medium">
        We truly appreciate your value and efforts in contributing towards a{" "}
        <b>veracity article</b>.
      </p>
      </header>
          <h2 className="text-2xl font-semibold mb-4">Create New Article</h2>

          {error && <p className="text-red-500">{error}</p>}

          <form className="space-y-6">
            {/* Article Title */}
            <div>
              <label
                htmlFor="articleTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Article Title
              </label>
              <input
                type="text"
                id="articleTitle"
                name="title"
                placeholder="The Uncanny Encounter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Article Description */}
            <div>
              <label
                htmlFor="articleDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Body
              </label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                className="mt-1 min-h-[300px] max-h-[600px] overflow-y-auto"
                placeholder="Raining heavily, the windows shattering against the walls..."
              />
            </div>

            {/* Tags Input */}
            <div>
              <label
                htmlFor="articleTags"
                className="block text-sm font-medium text-gray-700"
              >
                Tags (press Enter to add):
              </label>
              <input
                type="text"
                id="articleTags"
                placeholder="Enter tags..."
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Displaying Tags */}
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap space-x-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700"
                  >
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

            {/* Author Input */}
            <div>
              <label
                htmlFor="articleAuthor"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <input
                type="text"
                id="articleAuthor"
                placeholder="Enter your good name.."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="articleImage"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="articleImage"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>

            {/* Image Preview */}
            {articleImg && (
              <div className="mt-3 text-center">
                <img
                  src={articleImg}
                  alt="Uploaded"
                  className="w-full object-cover rounded-md"
                />
              </div>
            )}

            {/* Preview Button */}
            <button
              onClick={handlePreview}
              type="submit"
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Preview Article
            </button>
          </form>
        </div>

        {/* Article Preview */}
        {preview && previewArticleData && (
          <div className="preview-Article mt-10 px-6">
            <h3 className="text-xl font-semibold mb-3">Article Preview</h3>
            <ArticleCard article={previewArticleData} />
            <button
              className="mt-4 w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600"
              onClick={handleSubmit}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spinPulse />
              ) : (
                "Publish"
              )}
            </button>
          </div>
        )}
      </div>
  );
}
