"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import type { Chapter } from "@/lib/types";

export default function Dashboard() {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    loadChapters();
  }, [router]);

  const loadChapters = async () => {
    try {
      const data = await apiClient.getChapters();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setChapters(data);
      } else {
        console.error("Chapters data is not an array:", data);
        setError("Invalid data format received from server.");
      }
    } catch (err: any) {
      console.error("Error loading chapters:", err);
      if (err.response?.status === 401) {
        router.push("/auth/login");
      } else {
        setError("Failed to load chapters. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading chapters...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Select a Chapter</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {Array.isArray(chapters) && chapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {chapter.name}
              </h2>
              {chapter.description && (
                <p className="text-gray-600 text-sm mb-4">{chapter.description}</p>
              )}
              <Link
                href={`/quiz/${chapter.slug}`}
                className="block w-full py-2 text-center bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No chapters available at the moment.</p>
        </div>
      )}
    </div>
  );
}

