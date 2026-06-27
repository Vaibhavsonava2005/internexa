import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Calendar, Video, MapPin, Users, Ticket } from "lucide-react";

export default function EventsPage() {
  const events = [
    {
      id: "e1",
      title: "Global AI Hackathon 2026",
      type: "Hackathon",
      format: "Online",
      date: "Jul 15 - Jul 17, 2026",
      time: "48 Hours",
      attendees: 1250,
      description: "Build innovative AI solutions over a weekend. Mentorship from industry experts, $50,000 in prizes, and networking opportunities.",
      imageColor: "bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      id: "e2",
      title: "Mastering React Server Components",
      type: "Webinar",
      format: "Online",
      date: "Jul 05, 2026",
      time: "10:00 AM - 11:30 AM PT",
      attendees: 420,
      description: "Deep dive into React 19 and Server Components. Learn how to optimize your Next.js applications for maximum performance.",
      imageColor: "bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      id: "e3",
      title: "Tech Careers Summit",
      type: "Conference",
      format: "Hybrid (NY & Online)",
      date: "Aug 12, 2026",
      time: "9:00 AM - 5:00 PM EST",
      attendees: 850,
      description: "Connect with recruiters from top tech companies. Includes resume reviews, mock interviews, and panel discussions.",
      imageColor: "bg-emerald-100",
      textColor: "text-emerald-700"
    },
    {
      id: "e4",
      title: "System Design Live Mock Interview",
      type: "Live Session",
      format: "Online",
      date: "Jun 30, 2026",
      time: "2:00 PM - 3:30 PM PT",
      attendees: 315,
      description: "Watch a senior engineer from FAANG tackle a complex system design problem live, followed by Q&A.",
      imageColor: "bg-orange-100",
      textColor: "text-orange-700"
    },
    {
      id: "e5",
      title: "Python for Data Analysis Workshop",
      type: "Workshop",
      format: "Online",
      date: "Jul 22, 2026",
      time: "1:00 PM - 4:00 PM PT",
      attendees: 150,
      description: "Hands-on workshop covering Pandas, NumPy, and Matplotlib. Perfect for beginners transitioning into data roles.",
      imageColor: "bg-yellow-100",
      textColor: "text-yellow-700"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Upcoming Events & Workshops
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join our live sessions, hackathons, and webinars to upskill, network, and advance your career alongside a global community.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-brand-950 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-brand-800 flex flex-col md:flex-row gap-8 items-start md:items-center">
              
              {/* Event Date Block */}
              <div className="shrink-0 text-center w-32 hidden md:block">
                <div className="text-sm font-bold text-gray-500 dark:text-brand-500 uppercase tracking-wider mb-1">
                  {event.date.split(" ")[0]}
                </div>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {event.date.split(" ")[1].replace(",", "")}
                </div>
              </div>

              {/* Event Details */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.imageColor} ${event.textColor}`}>
                    {event.type}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                    {event.format === "Online" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    <span>{event.format}</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-3xl">
                  {event.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees}+ Attending</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <button className="w-full md:w-auto px-6 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-brand-100 text-white dark:text-brand-900 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Ticket className="w-4 h-4" />
                  Register Now
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
