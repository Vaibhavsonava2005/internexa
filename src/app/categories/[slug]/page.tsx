import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import { CATEGORIES, FEATURED_INTERNSHIPS } from "@/lib/constants";
import { ArrowRight, Star, Users } from "lucide-react";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const categoryTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const categoryData = CATEGORIES.find(c => c.name.toLowerCase() === categoryTitle.toLowerCase()) || {
    name: categoryTitle,
    description: "Explore industry-leading internship programs in this domain.",
    count: "10+ Programs"
  };

  const relatedInternships = FEATURED_INTERNSHIPS.filter(i => 
    i.category.toLowerCase().includes(categoryTitle.toLowerCase().split(' ')[0])
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Link href="/categories" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 w-fit mb-6">
              ← Back to Categories
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryData.name} Internships</h1>
            <p className="text-xl text-slate-400 max-w-2xl">{categoryData.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedInternships.length > 0 ? relatedInternships.map((internship, i) => (
              <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold">
                    {internship.duration}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                    <Star className="w-4 h-4 fill-current" /> {internship.rating}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{internship.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{internship.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Users className="w-4 h-4" /> {internship.enrolled}
                  </div>
                  <Link href={`/internships/${internship.id}`} className="text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300">
                    View <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
                <h3 className="text-2xl font-bold mb-2">More programs coming soon!</h3>
                <p className="text-slate-400 mb-6">We are currently developing advanced curriculum for this category.</p>
                <Link href="/internships" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold">
                  Browse All Internships
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
