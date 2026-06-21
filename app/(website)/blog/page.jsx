import {
  BookOpen,
  GraduationCap,
  Briefcase,
  Cpu,
  TrendingUp,
  Search,
  ArrowRight,
} from "lucide-react";

export default function BlogPage() {
  const categories = [
    {
      title: "Study Tips",
      icon: <BookOpen size={28} />,
      count: "120+ Articles",
    },
    {
      title: "RTU Exams",
      icon: <GraduationCap size={28} />,
      count: "80+ Articles",
    },
    {
      title: "Placement",
      icon: <Briefcase size={28} />,
      count: "60+ Articles",
    },
    {
      title: "Technology",
      icon: <Cpu size={28} />,
      count: "90+ Articles",
    },
  ];

  const blogs = [
    {
      title: "How To Score 8.5+ CGPA In RTU",
      category: "Study Tips",
      readTime: "10 min read",
    },
    {
      title: "Best Strategy To Solve RTU PYQs",
      category: "RTU Exams",
      readTime: "8 min read",
    },
    {
      title: "Top Final Year Project Ideas 2026",
      category: "Technology",
      readTime: "12 min read",
    },
  ];

  return (
    <main className="bg-slate-50 min-h-screen">

      {/* HERO */}
      <section className="bg-[#071A3D] text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <span className="bg-[#E8700A]/20 text-[#E8700A] px-4 py-2 rounded-full text-sm font-semibold">
            RTU Learning Hub
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
            Learn Smarter,
            <br />
            Score Higher.
          </h1>

          <p className="text-slate-300 text-lg mt-6 max-w-2xl">
            Notes, PYQs, Placement Preparation, CGPA Tips,
            Technology Guides and Career Resources for RTU Students.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <button className="bg-[#E8700A] px-6 py-3 rounded-xl font-semibold">
              Explore Articles
            </button>

            <button className="border border-white/20 px-6 py-3 rounded-xl">
              Latest Updates
            </button>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-5">
          <div className="flex items-center gap-3">
            <Search className="text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full outline-none"
            />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-gradient-to-r from-[#071A3D] to-[#142647] rounded-3xl p-10 text-white">
          <span className="text-[#E8700A] font-semibold">
            🔥 Featured Article
          </span>

          <h2 className="text-4xl font-bold mt-4">
            How To Score 8.5+ CGPA In RTU B.Tech
          </h2>

          <p className="text-slate-300 mt-4 max-w-3xl">
            Complete roadmap covering notes, PYQs,
            internal exams, practicals and semester strategy.
          </p>

          <button className="mt-6 flex items-center gap-2 text-[#E8700A] font-semibold">
            Read Article
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-[#071A3D] mb-8">
          Explore Categories
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
            >
              <div className="text-[#E8700A]">
                {item.icon}
              </div>

              <h3 className="font-bold text-xl mt-4">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-2">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="text-[#E8700A]" />
          <h2 className="text-3xl font-bold text-[#071A3D]">
            Trending Articles
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="h-52 bg-gradient-to-r from-[#071A3D] to-[#E8700A]" />

              <div className="p-6">
                <span className="text-sm text-[#E8700A] font-semibold">
                  {blog.category}
                </span>

                <h3 className="font-bold text-xl mt-3">
                  {blog.title}
                </h3>

                <p className="text-gray-500 mt-3">
                  {blog.readTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLACEMENT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-10 shadow-sm">
          <h2 className="text-3xl font-bold text-[#071A3D]">
            🚀 Placement Preparation
          </h2>

          <div className="grid md:grid-cols-4 gap-5 mt-8">
            {[
              "Resume Building",
              "Interview Questions",
              "TCS NQT Guide",
              "LinkedIn Profile Setup",
            ].map((item, i) => (
              <div
                key={i}
                className="border rounded-xl p-5 hover:border-[#E8700A]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#071A3D] rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold">
            Never Miss RTU Updates
          </h2>

          <p className="text-slate-300 mt-4">
            Get Notes, PYQs, Placement Tips and Exam Updates.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto mt-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-14 rounded-xl px-4 text-black"
            />

            <button className="bg-[#E8700A] px-8 rounded-xl font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}