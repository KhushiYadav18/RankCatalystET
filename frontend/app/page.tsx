"use client";

import Link from "next/link";
import Image from "next/image";
import ChemistryBackground from "@/components/background/ChemistryBackground";
import Footer from "@/components/layout/Footer";

interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
  image: string;
}

const clients: TeamMember[] = [
  {
    name: "Kshitij Sharma",
    role: "Client",
    linkedin: "https://www.linkedin.com/in/kshitij-sharma-6973006a/?originalSubdomain=no",
    image: "/team/clients/kshitij-sharma.jpg",
  },
  {
    name: "Ramkumar Rajendran",
    role: "Client",
    linkedin: "https://www.linkedin.com/in/ramkumar-rajendran-06b61618/?originalSubdomain=in",
    image: "/team/clients/ramkumar-rajendran.jpg",
  },
  {
    name: "Aditya Rajmane",
    role: "Client",
    linkedin: "https://www.linkedin.com/in/adityarajmane/",
    image: "/team/clients/aditya-rajmane.jpg",
  },
];

const developers: TeamMember[] = [
  {
    name: "Kaushik Mandal",
    role: "Developer",
    linkedin: "https://www.linkedin.com/in/kaushik-mandal-6562a5294/",
    image: "/team/developers/kaushik-mandal.jpeg",
  },
  {
    name: "Khushi Yadav",
    role: "Developer",
    linkedin: "https://www.linkedin.com/in/khushi-yadav-0275b6293/",
    image: "/team/developers/khushi-yadav.jpg",
  },
  {
    name: "Ashwani Dubey",
    role: "Developer",
    linkedin: "https://www.linkedin.com/in/ashwani-dubey-3b2a81258/",
    image: "/team/developers/ashwani-dubey.jpg",
  },
  {
    name: "Aman Raj",
    role: "Developer",
    linkedin: "https://www.linkedin.com/in/aman-raj-328825280/",
    image: "/team/developers/aman-raj.jpg",
  },
];

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback to a colored div if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.parentElement) {
              target.parentElement.className = "relative w-32 h-32 mx-auto mb-4 rounded-full bg-primary-200 flex items-center justify-center";
              const text = document.createElement("div");
              text.className = "text-primary-600 text-2xl font-bold";
              text.textContent = member.name.charAt(0);
              target.parentElement.appendChild(text);
            }
          }}
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
      <p className="text-gray-600 mb-4">{member.role}</p>
      <Link
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        <span>LinkedIn</span>
      </Link>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <ChemistryBackground />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
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
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              About Us
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-primary-600 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  RankCatalyst is an innovative Intelligent Tutoring System designed specifically
                  for JEE Chemistry preparation. We combine cutting-edge technology with
                  educational expertise to provide a personalized learning experience that adapts
                  to each student's unique learning pace and style.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Our platform leverages real-time attention tracking to monitor student engagement
                  and focus during quiz sessions. This allows us to provide immediate, personalized
                  feedback and identify areas where students may need additional support.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-primary-600 mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Adaptive learning algorithms that personalize content delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Real-time attention tracking using advanced eye-tracking technology</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Comprehensive performance analytics and detailed progress reports</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Extensive question bank covering all JEE Chemistry topics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Instant feedback and explanations for better understanding</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Meet the talented individuals behind RankCatalyst who are dedicated to revolutionizing
              JEE Chemistry preparation through innovative technology.
            </p>

            {/* Clients Section */}
            <div className="mb-20">
              <h3 className="text-3xl font-semibold text-center text-gray-900 mb-12">
                Clients
              </h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {clients.map((client, index) => (
                  <TeamMemberCard key={index} member={client} />
                ))}
              </div>
            </div>

            {/* Developers Section */}
            <div>
              <h3 className="text-3xl font-semibold text-center text-gray-900 mb-12">
                Developers
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {developers.map((developer, index) => (
                  <TeamMemberCard key={index} member={developer} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

