"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
  image: string;
}

const clients: TeamMember[] = [
  {
    name: "Client One",
    role: "Client",
    linkedin: "https://linkedin.com/in/clientone",
    image: "/placeholder-avatar.png",
  },
  {
    name: "Client Two",
    role: "Client",
    linkedin: "https://linkedin.com/in/clienttwo",
    image: "/placeholder-avatar.png",
  },
];

const developers: TeamMember[] = [
  {
    name: "Developer One",
    role: "Developer",
    linkedin: "https://linkedin.com/in/developerone",
    image: "/placeholder-avatar.png",
  },
  {
    name: "Developer Two",
    role: "Developer",
    linkedin: "https://linkedin.com/in/developertwo",
    image: "/placeholder-avatar.png",
  },
  {
    name: "Developer Three",
    role: "Developer",
    linkedin: "https://linkedin.com/in/developerthree",
    image: "/placeholder-avatar.png",
  },
  {
    name: "Developer Four",
    role: "Developer",
    linkedin: "https://linkedin.com/in/developerfour",
    image: "/placeholder-avatar.png",
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
        <FaLinkedin className="text-xl" />
        <span>LinkedIn</span>
      </Link>
    </div>
  );
};

export default function TeamPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Our Team
        </h1>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Meet the talented individuals behind RankCatalyst who are dedicated to revolutionizing 
          JEE Chemistry preparation through innovative technology.
        </p>

        {/* Clients Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            Clients
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {clients.map((client, index) => (
              <TeamMemberCard key={index} member={client} />
            ))}
          </div>
        </section>

        {/* Developers Section */}
        <section>
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            Developers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developers.map((developer, index) => (
              <TeamMemberCard key={index} member={developer} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

