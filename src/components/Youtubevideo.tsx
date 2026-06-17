"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaPlay, FaTimes } from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

const Youtubevideo = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/youtube");
        const data = await res.json();

        const validVideos =
          data.items?.filter(
            (video: Video) =>
              video?.id?.videoId && video?.snippet?.thumbnails?.high?.url
          ) || [];

        setVideos(validVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#071A3D]">
              Latest Video Lectures
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Watch RTU Solutions Latest Tutorials & Exam Preparation Videos
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={25}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id.videoId}>
                <div
                  onClick={() => setSelectedVideo(video.id.videoId)}
                  className="
                    group
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    shadow-lg
                    hover:shadow-2xl
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    cursor-pointer
                  "
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="
                        w-full
                        h-60
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/40
                        flex
                        items-center
                        justify-center
                        opacity-0
                        group-hover:opacity-100
                        transition
                      "
                    >
                      <div
                        className="
                          w-16
                          h-16
                          bg-red-600
                          rounded-full
                          flex
                          items-center
                          justify-center
                          shadow-xl
                        "
                      >
                        <FaPlay className="text-white text-xl ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3
                      className="
                        text-lg
                        font-bold
                        text-[#071A3D]
                        line-clamp-2
                      "
                    >
                      {video.snippet.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-3">
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Video Modal */}

      {selectedVideo && (
        <div
          className="
            fixed
            inset-0
            bg-black/90
            z-999
            flex
            items-center
            justify-center
            p-4
          "
        >
          <button
            onClick={() => setSelectedVideo("")}
            className="
              absolute
              top-5
              right-5
              text-white
              text-3xl
              hover:text-red-500
            "
          >
            <FaTimes />
          </button>

          <div className="w-full max-w-6xl aspect-video">
            <iframe
              className="w-full h-full rounded-2xl"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Youtubevideo;