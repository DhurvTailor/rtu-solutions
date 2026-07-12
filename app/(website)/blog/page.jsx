export const revalidate = 3600; // 1 hour ISR

async function getBlogs() {
  try {
    const res = await fetch("https://www.rtu-solutions.me/api/blogs", {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Blog | RTU Solutions - Exam Updates, Study Tips & Syllabus Guides",
  description:
    "RTU B.Tech students ke liye latest exam updates, syllabus guides, study tips aur placement news. RTU Solutions blog padho.",
  alternates: {
    canonical: "https://www.rtu-solutions.me/blog",
  },
};

export default async function BlogListPage() {
  const blogs = await getBlogs();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">RTU Solutions Blog</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Exam updates, syllabus guides aur study tips — sab kuch RTU B.Tech students ke liye.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">
          Jald hi naye blogs aa rahe hain. Thoda ruko!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <a
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card"
            >
              <div className="aspect-video bg-muted overflow-hidden">
                {blog.cover_blob_name ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/blogs/thumbnail?blob=${blog.cover_blob_name}`}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    RTU Solutions
                  </div>
                )}
              </div>
              <div className="p-4">
                {blog.category && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {blog.category}
                  </span>
                )}
                <h2 className="text-lg font-semibold mt-2 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{blog.description}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {blog.published_at
                    ? new Date(blog.published_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}