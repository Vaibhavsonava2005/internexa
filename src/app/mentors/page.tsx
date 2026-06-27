import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Star, Building2, MapPin, Award } from "lucide-react";

export default function MentorsPage() {
  const mentors = [
    {
      id: "m1",
      name: "Sarah Chen",
      role: "Senior Staff Engineer",
      company: "Google",
      location: "San Francisco, CA",
      experience: "12+ Years",
      rating: 4.9,
      reviews: 128,
      bio: "Passionate about scalable distributed systems and mentoring the next generation of women in tech. I specialize in system design and backend architecture.",
      skills: ["System Design", "Go", "Kubernetes", "Microservices"],
      imageUrl: "https://i.pravatar.cc/150?img=47"
    },
    {
      id: "m2",
      name: "David Kumar",
      role: "Product Design Lead",
      company: "Stripe",
      location: "Remote",
      experience: "8 Years",
      rating: 5.0,
      reviews: 94,
      bio: "Helping designers transition from UI to Product Strategy. I can help you build an outstanding portfolio and ace your whiteboard challenges.",
      skills: ["UX Research", "Figma", "Design Systems", "Prototyping"],
      imageUrl: "https://i.pravatar.cc/150?img=11"
    },
    {
      id: "m3",
      name: "Elena Rodriguez",
      role: "VP of Engineering",
      company: "Netflix",
      location: "New York, NY",
      experience: "15+ Years",
      rating: 4.8,
      reviews: 215,
      bio: "Former startup founder turned engineering executive. I mentor engineering managers and senior ICs on leadership, team scaling, and technical strategy.",
      skills: ["Engineering Management", "Leadership", "React", "Node.js"],
      imageUrl: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: "m4",
      name: "James Wilson",
      role: "Data Science Manager",
      company: "Meta",
      location: "London, UK",
      experience: "10 Years",
      rating: 4.9,
      reviews: 156,
      bio: "Bridging the gap between business strategy and machine learning. Expert in recommendation systems and natural language processing.",
      skills: ["Python", "Machine Learning", "PyTorch", "SQL"],
      imageUrl: "https://i.pravatar.cc/150?img=33"
    },
    {
      id: "m5",
      name: "Amira Hassan",
      role: "Security Engineer",
      company: "Cloudflare",
      location: "Austin, TX",
      experience: "7 Years",
      rating: 4.9,
      reviews: 82,
      bio: "Dedicated to building secure applications by design. I can help you prepare for security engineering interviews and certifications.",
      skills: ["AppSec", "Penetration Testing", "Cryptography", "AWS Security"],
      imageUrl: "https://i.pravatar.cc/150?img=20"
    },
    {
      id: "m6",
      name: "Michael Chang",
      role: "Senior Product Manager",
      company: "Atlassian",
      location: "Sydney, AU",
      experience: "9 Years",
      rating: 4.7,
      reviews: 110,
      bio: "Transitioned from engineering to product. I help aspiring PMs master product sense, execution, and behavioral interviews.",
      skills: ["Product Strategy", "Agile", "User Stories", "A/B Testing"],
      imageUrl: "https://i.pravatar.cc/150?img=60"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Learn from Industry Leaders
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Connect with experienced professionals from top tech companies. Get personalized guidance, resume reviews, and interview preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-white dark:bg-brand-950 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-brand-800 overflow-hidden flex flex-col">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-brand-800 shrink-0">
                    <img src={mentor.imageUrl} alt={mentor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{mentor.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">{mentor.role}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-500">
                      <Building2 className="w-4 h-4" />
                      <span>{mentor.company}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{mentor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>{mentor.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{mentor.rating}</span>
                    <span>({mentor.reviews})</span>
                  </div>
                </div>

                <p className="mt-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {mentor.bio}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {mentor.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-brand-900 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto p-6 pt-0">
                <button className="w-full py-3 bg-white dark:bg-brand-950 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-semibold rounded-xl transition-colors">
                  View Profile & Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
