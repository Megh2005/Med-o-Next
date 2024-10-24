"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticlesList from "../articlesList/page";

export default function Dashboard() {
  return (
    <>
      <ToastContainer />
      <ProtectedRoute>
        <div className="flex space-x-6 justify-between">
          <Sidebar />
          <ArticlesList />
        </div>
      </ProtectedRoute>
    </>
  );
}
