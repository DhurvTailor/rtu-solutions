// "use client";

// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import { FaPlay, FaTimes } from "react-icons/fa";

// import "swiper/css";
// import "swiper/css/pagination";

// interface Video {
//   id: {
//     videoId: string;
//   };
//   snippet: {
//     title: string;
//     channelTitle: string;
//     thumbnails: {
//       high: {
//         url: string;
//       };
//     };
//   };
// }

// const Youtubevideo = () => {
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [selectedVideo, setSelectedVideo] = useState("");

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await fetch("/api/youtube");
//         const data = await res.json();

//         const validVideos =
//           data.items?.filter(
//             (video: Video) =>
//               video?.id?.videoId && video?.snippet?.thumbnails?.high?.url
//           ) || [];

//         setVideos(validVideos);
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//       }
//     };

//     fetchVideos();
//   }, []);

//   return (
//     <>
//       <section className="py-20 bg-gray-50 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-5">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl md:text-5xl font-bold text-[#071A3D]">
//               Latest Video Lectures
//             </h2>

//             <p className="text-gray-500 mt-4 text-lg">
//               Watch RTU Solutions Latest Tutorials & Exam Preparation Videos
//             </p>
//           </div>

//           <Swiper
//             modules={[Autoplay, Pagination]}
//             spaceBetween={25}
          
//             slidesPerView={1}
//             autoplay={{
//               delay: 3000,
//               disableOnInteraction: false,
//             }}
//             pagination={{
//               clickable: true,
//             }}
//             breakpoints={{
//               640: {
//                 slidesPerView: 1,
//               },
//               768: {
//                 slidesPerView: 2,
//               },
//               1024: {
//                 slidesPerView: 4,
//               },
//             }}
//           >
//             {videos.map((video) => (
//               <SwiperSlide key={video.id.videoId}>
//                 <div
//                   onClick={() => setSelectedVideo(video.id.videoId)}
//                   className="
//                     group
//                     bg-[#f3f0f0]
//                     rounded-3xl
//                     overflow-hidden
//                     shadow-lg
//                     hover:shadow-2xl
//                     transition-all
//                     duration-500
//                     hover:-translate-y-2
//                     cursor-pointer
//                   "
//                 >
//                   <div className="relative overflow-hidden">
//                     <img
//                       src={video.snippet.thumbnails.high.url}
//                       alt={video.snippet.title}
//                       className="
//                         w-full
//                         h-60
//                         object-cover
//                         transition-transform
//                         duration-500
//                         group-hover:scale-110
//                       "
//                     />

//                     <div
//                       className="
//                         absolute
//                         inset-0
//                         bg-black/40
//                         flex
//                         items-center
//                         justify-center
//                         opacity-0
//                         group-hover:opacity-100
//                         transition
                      
//                       "
//                     >
//                       <div
//                         className=" 
//                           w-16
//                           h-16
//                           bg-red-600
//                           rounded-full
//                           flex
//                           items-center
//                           justify-center
//                           shadow-xl
//                         "
//                       >
//                         <FaPlay className="text-white text-xl ml-1" />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-5 ">
//                     <h3
//                       className="
//                         text-lg
//                         font-bold
//                         text-[#071A3D]
//                         line-clamp-2
//                       "
//                     >
//                       {video.snippet.title}
//                     </h3>

//                     <p className="text-gray-500 text-sm mt-3">
//                       {video.snippet.channelTitle}
//                     </p>
 
                        

//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </section>

//       {/* Video Modal */}

//       {selectedVideo && (
//         <div
//           className="
//             fixed
//             inset-0
//             bg-[#e10000]
//             z-999
//             flex
//             items-center
//             justify-center
//             p-4
            
            
//           "
//         >
//           <button
//             onClick={() => setSelectedVideo("")}
//             className="
//               absolute
//               top-5
//               right-5
//               text-white
//               text-3xl
//               hover:text-red-500
//             "
//           >
//             <FaTimes />
//           </button>

//           <div className="w-full max-w-6xl aspect-video">
//             <iframe
//               className="w-full h-full rounded-2xl"
//               src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
//               title="YouTube Video"
//               allow="autoplay; encrypted-media"
//               allowFullScreen
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Youtubevideo;




"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaPlay, FaTimes } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

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
  statistics?: {
    viewCount: string;
  };
}

function formatViews(count) {
  const n = parseInt(count, 10) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
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
      <section className="py-24 bg-[#071A3D] overflow-hidden relative">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-[#E8700A] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                Video Lectures
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Learn From Our Latest Uploads
              </h2>
            </div>
            <p className="text-slate-400 text-base max-w-sm">
              Exam preparation, concept breakdowns, and revision sessions —
              straight from the RTU Solutions channel.
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".video-pagination",
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-4!"
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id.videoId}>
                <div
                  onClick={() => setSelectedVideo(video.id.videoId)}
                  className="group bg-white/3 border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/6 hover:border-[#E8700A]/40 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay for premium depth */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#E8700A] flex items-center justify-center shadow-lg shadow-black/30 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                        <FaPlay className="text-white text-sm ml-0.5" />
                      </div>
                    </div>

                    {/* View count badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <FiEye size={12} className="text-white/80" />
                      <span className="text-white text-xs font-semibold">
                        {formatViews(video.statistics?.viewCount)} views
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#E8700A] transition-colors">
                      {video.snippet.title}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="video-pagination flex justify-center gap-2 mt-8 [&_.swiper-pagination-bullet]:bg-white/20 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet-active]:bg-[#E8700A] [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:rounded-full" />
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 z-999 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            onClick={() => setSelectedVideo("")}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-[#E8700A] flex items-center justify-center text-white text-lg transition-colors"
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