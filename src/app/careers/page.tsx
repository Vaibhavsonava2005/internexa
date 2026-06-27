import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function CareersPage() {
  const openings = [
    { title: "Senior AI Engineer", department: "Engineering", location: "San Francisco / Remote" },
    { title: "Product Designer", department: "Design", location: "New York / Remote" },
    { title: "Student Success Manager", department: "Operations", location: "Remote" },
    { title: "Developer Relations Advocate", department: "Marketing", location: "London / Remote" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-6">Join Our Team</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We are on a mission to reshape the future of education and career development. If you are passionate about building innovative AI tools that empower students, we want you on our team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-3xl font-bold text-brand-900 dark:text-white mb-6">Why InterNexa?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-brand-500 mr-3 text-xl">✦</span>
                  <p className="text-gray-600 dark:text-gray-300"><strong className="text-brand-900 dark:text-white">Impact-Driven:</strong> Every line of code you write helps a student launch their career.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-500 mr-3 text-xl">✦</span>
                  <p className="text-gray-600 dark:text-gray-300"><strong className="text-brand-900 dark:text-white">Continuous Learning:</strong> We provide a generous educational stipend and dedicated learning days.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-500 mr-3 text-xl">✦</span>
                  <p className="text-gray-600 dark:text-gray-300"><strong className="text-brand-900 dark:text-white">Remote-First:</strong> Work from anywhere. We value results and collaboration over physical presence.</p>
                </li>
              </ul>
            </div>
            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-8 border border-brand-100 dark:border-brand-800/50">
              <h2 className="text-2xl font-semibold text-brand-900 dark:text-white mb-6">Open Positions</h2>
              <div className="space-y-4">
                {openings.map((job, idx) => (
                  <div key={idx} className="block group cursor-pointer bg-white dark:bg-[#111] p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">{job.title}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
                      <span>{job.department}</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
