import { notFound } from "next/navigation";
import { getBlogBySlug, getAllPublishedSlugs } from "@/services/blogService";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "Blog Not Found | RTU Solutions" };
  }

  const url = `https://www.rtu-solutions.me/blog/${blog.slug}`;
  const imageUrl = blog.cover_blob_name
    ? `https://www.rtu-solutions.me/api/blogs/thumbnail?blob=${blog.cover_blob_name}`
    : "https://www.rtu-solutions.me/hero.webp";

  return {
    title: `${blog.title} | RTU Solutions Blog`,
    description: blog.description,
    alternates: { canonical: url },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url,
      type: "article",
      images: [{ url: imageUrl }],
      publishedTime: blog.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const url = `https://www.rtu-solutions.me/blog/${blog.slug}`;
  const imageUrl = blog.cover_blob_name
    ? `https://www.rtu-solutions.me/api/blogs/thumbnail?blob=${blog.cover_blob_name}`
    : "https://www.rtu-solutions.me/hero.webp";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    image: imageUrl,
    author: {
      "@type": "Organization",
      name: blog.author_name || "RTU Solutions Team",
    },
    publisher: {
      "@type": "Organization",
      name: "RTU Solutions",
      logo: {
        "@type": "ImageObject",
        url: "https://www.rtu-solutions.me/logo.jpg",
      },
    },
    datePublished: blog.published_at,
    dateModified: blog.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <a href="/blog" className="hover:text-primary">Blog</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">{blog.title}</span>
        </nav>

        {/* Category badge */}
        {blog.category && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {blog.category}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4 leading-tight">{blog.title}</h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
          <span>By {blog.author_name || "RTU Solutions Team"}</span>
          <span>•</span>
          <time dateTime={blog.published_at}>
            {blog.published_at
              ? new Date(blog.published_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </time>
        </div>

        {blog.cover_blob_name && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full aspect-[16/9] object-cover rounded-xl mb-8"
          />
        )}

        {/* Content — admin-authored HTML, sirf admin write kar sakta hai isliye safe hai */}
        <article
          className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-12 pt-8 border-t">
          <a
            href="/blog"
            className="text-primary hover:underline text-sm font-medium"
          >
            ← Sabhi blogs dekho
          </a>
        </div>
      </main>
    </>
  );
}