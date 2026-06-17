
// components/BlogCard.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";

export default function BlogCard({
  title,
  image,
  slug,
  date,
  author,
  category,
  excerpt,
}) {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      overflow-hidden
      border
      border-gray-200
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
      hover:-translate-y-2
      "
    >
      {/* Blog Image */}

      <div className="relative h-60 overflow-hidden">

        <Image
          src={image}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition duration-500"
        />

        {/* Category Badge */}

        <div className="absolute top-4 left-4">
          <span
            className="
            bg-orange-500
            text-white
            px-3
            py-1
            rounded-full
            text-xs
            font-medium
            "
          >
            {category}
          </span>
        </div>

      </div>

      {/* Content */}

      <div className="p-6">

        {/* Meta */}

        <div className="flex items-center gap-5 text-gray-500 text-sm">

          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            {date}
          </div>

          <div className="flex items-center gap-2">
            <FaUser />
            {author}
          </div>

        </div>

        {/* Title */}

        <h3
          className="
          text-xl
          font-bold
          text-[#071A3D]
          mt-4
          line-clamp-2
          "
        >
          {title}
        </h3>

        {/* Description */}

        <p
          className="
          text-gray-600
          mt-3
          leading-7
          line-clamp-3
          "
        >
          {excerpt}
        </p>

        {/* Read More */}

        <Link
          href={`/blog/${slug}`}
          className="
          mt-6
          inline-flex
          items-center
          gap-2
          text-orange-500
          font-semibold
          hover:gap-3
          transition-all
          "
        >
          Read More
          <FaArrowRight />
        </Link>

      </div>
    </div>
  );
}