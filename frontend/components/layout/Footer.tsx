import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">RankCatalyst</h3>
            <p className="text-sm">
              An Intelligent Tutoring System for JEE Chemistry Preparation
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-primary-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-primary-400 transition-colors">
                  Team
                </a>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-primary-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <p className="text-sm">
              For inquiries and support, please reach out through our platform.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} RankCatalyst. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

