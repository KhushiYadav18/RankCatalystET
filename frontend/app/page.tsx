import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">RankCatalyst</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          An Intelligent Tutoring System for JEE Chemistry Preparation
        </p>
        <p className="text-gray-500 mb-12">
          Experience adaptive learning with real-time attention tracking and personalized feedback
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

