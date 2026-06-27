import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { BookOpen, Code, Cpu, Database, Layout, LineChart, Shield, Smartphone } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    {
      id: "software-engineering",
      title: "Software Engineering",
      description: "Master full-stack development, system design, and software architecture to build scalable applications.",
      icon: <Code className="w-8 h-8 text-blue-500" />,
      courses: 24,
      internships: 15
    },
    {
      id: "data-science",
      title: "Data Science & AI",
      description: "Dive into machine learning algorithms, deep learning, data visualization, and predictive analytics.",
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
      courses: 18,
      internships: 12
    },
    {
      id: "product-design",
      title: "UI/UX Design",
      description: "Learn user research, wireframing, prototyping, and interaction design using modern tools.",
      icon: <Layout className="w-8 h-8 text-pink-500" />,
      courses: 15,
      internships: 8
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      description: "Understand ethical hacking, network security, cryptography, and risk management.",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      courses: 10,
      internships: 5
    },
    {
      id: "cloud-computing",
      title: "Cloud Computing",
      description: "Get hands-on with AWS, Azure, Google Cloud, Docker, and Kubernetes deployment strategies.",
      icon: <Database className="w-8 h-8 text-sky-500" />,
      courses: 14,
      internships: 10
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing",
      description: "Explore SEO, SEM, social media strategy, content marketing, and growth hacking.",
      icon: <LineChart className="w-8 h-8 text-green-500" />,
      courses: 12,
      internships: 6
    },
    {
      id: "mobile-development",
      title: "Mobile App Development",
      description: "Build cross-platform and native mobile apps using React Native, Flutter, Swift, and Kotlin.",
      icon: <Smartphone className="w-8 h-8 text-yellow-500" />,
      courses: 16,
      internships: 9
    },
    {
      id: "business-analytics",
      title: "Business Analytics",
      description: "Analyze business metrics, master SQL, Tableau, and Excel to drive data-informed decisions.",
      icon: <BookOpen className="w-8 h-8 text-indigo-500" />,
      courses: 11,
      internships: 7
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Explore Learning Domains
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover a wide range of categories tailored for your career growth. Choose your path and start learning today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
              <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{category.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{category.courses}</span> Courses
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{category.internships}</span> Internships
                </div>
              </div>
              
              <Link 
                href={`/categories/${category.id}`}
                className="mt-6 inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Category
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
