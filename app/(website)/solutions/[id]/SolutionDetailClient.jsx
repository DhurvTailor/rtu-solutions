
// // "use client";

// // import { useState } from "react";
// // import { FiLock, FiDownload, FiFileText, FiShare2, FiCopy, FiCheck } from "react-icons/fi";
// // import { FaWhatsapp, FaYoutube } from "react-icons/fa";
// // import toast from "react-hot-toast";

// // function slugify(text) {
// //   return text
// //     .toLowerCase()
// //     .replace(/[^\w\s-]/g, "")
// //     .replace(/\s+/g, "-")
// //     .replace(/-+/g, "-")
// //     .trim();
// // }

// // export default function SolutionDetailClient({ solution }) {
// //   const [copied, setCopied] = useState(false);
// //   const [shareOpen, setShareOpen] = useState(false);

// //   const price = parseFloat(solution.price || 0);
// //   const shareUrl = `https://www.rtu-solutions.me/solutions/${solution.id}-${slugify(solution.title)}`;

// //   const handleCopyLink = async () => {
// //     try {
// //       await navigator.clipboard.writeText(shareUrl);
// //       setCopied(true);
// //       toast.success("Link copy ho gaya!");
// //       setTimeout(() => setCopied(false), 2000);
// //     } catch {
// //       toast.error("Copy nahi hua, dobara try karo");
// //     }
// //   };

// //   const handleNativeShare = async () => {
// //     if (navigator.share) {
// //       try {
// //         await navigator.share({
// //           title: solution.title,
// //           text: `Check out ${solution.title} on RTU Solutions`,
// //           url: shareUrl,
// //         });
// //       } catch {
// //         // user ne cancel kiya — ignore
// //       }
// //     } else {
// //       setShareOpen((v) => !v);
// //     }
// //   };

// //   const handleWhatsappShare = () => {
// //     const text = encodeURIComponent(`${solution.title} - RTU Solutions\n${shareUrl}`);
// //     window.open(`https://wa.me/?text=${text}`, "_blank");
// //   };

// //   return (
// //     <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
// //       <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

// //         {/* PDF preview */}
// //         <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
// //           {solution.preview_blob_name ? (
// //             <iframe
// //               src={`/api/preview?id=${solution.id}`}
// //               className="w-full h-150"
// //               title="PDF preview"
// //             />
// //           ) : (
// //             <div className="h-100 flex flex-col items-center justify-center text-gray-400">
// //               <FiFileText size={28} className="mb-2" />
// //               <p>Is solution ke liye preview available nahi hai</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Details + Buy + Share */}
// //         <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-6">

// //           <div className="flex items-start justify-between gap-2">
// //             <h1 className="text-xl font-bold text-[#071A3D]">{solution.title}</h1>

// //             {/* Share button */}
// //             <div className="relative shrink-0">
// //               <button
// //                 onClick={handleNativeShare}
// //                 className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition shrink-0"
// //               >
// //                 <FiShare2 size={15} className="text-gray-500" />
// //               </button>

// //               {/* Fallback share dropdown (desktop) */}
// //               {shareOpen && (
// //                 <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
// //                   <button
// //                     onClick={() => { handleCopyLink(); setShareOpen(false); }}
// //                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700"
// //                   >
// //                     {copied ? <FiCheck size={15} className="text-green-500" /> : <FiCopy size={15} />}
// //                     {copied ? "Copied!" : "Copy link"}
// //                   </button>
// //                   <button
// //                     onClick={() => { handleWhatsappShare(); setShareOpen(false); }}
// //                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700 border-t border-gray-100"
// //                   >
// //                     <FaWhatsapp size={15} className="text-green-500" />
// //                     Share on WhatsApp
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           <p className="text-sm text-gray-400 mt-1">{solution.subject_name}</p>

// //           {solution.description && (
// //             <p className="text-sm text-gray-600 mt-3">{solution.description}</p>
// //           )}

// //           {/* Quick copy link row */}
// //           <button
// //             onClick={handleCopyLink}
// //             className="mt-4 w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 hover:bg-gray-100 transition"
// //           >
// //             <span className="truncate">{shareUrl}</span>
// //             {copied ? (
// //               <FiCheck size={14} className="text-green-500 shrink-0" />
// //             ) : (
// //               <FiCopy size={14} className="shrink-0" />
// //             )}
// //           </button>

// //           <div className="mt-6 pt-6 border-t">
// //             {solution.is_premium ? (
// //               <>
// //                 <p className="text-2xl font-bold text-[#E8700A] mb-3">
// //                   ₹{price.toFixed(0)}
// //                 </p>
// //                 <a
// //                   href={`/checkout?solution_id=${solution.id}`}
// //                   className="w-full inline-flex items-center justify-center gap-2 bg-[#071A3D] hover:bg-[#0d2a5e] text-white py-3 rounded-xl font-semibold transition"
// //                 >
// //                   <FiLock size={15} /> Buy & Download
// //                 </a>
// //               </>
// //             ) : (
// //               <a
// //                 href={`/api/download?id=${solution.id}`}
// //                 className="w-full inline-flex items-center justify-center gap-2 bg-[#E8700A] hover:bg-[#cf6209] text-white py-3 rounded-xl font-semibold transition"
// //               >
// //                 <FiDownload size={15} /> Download Free
// //               </a>
// //             )}

// //             {/* ── NEW: Watch Free Video button, only shown when a YouTube link exists ── */}
// //             {solution.youtube_url && (
// //               <a
// //                 href={solution.youtube_url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 py-3 rounded-xl font-semibold transition"
// //               >
// //                 <FaYoutube size={16} /> Watch Free Video
// //               </a>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }




// "use client";

// import { useState } from "react";
// import { FiLock, FiDownload, FiFileText, FiShare2, FiCopy, FiCheck, FiInfo } from "react-icons/fi";
// import { FaWhatsapp, FaYoutube } from "react-icons/fa";
// import toast from "react-hot-toast";


// function slugify(text) {
//   return text
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .trim();
// }

// export default function SolutionDetailClient({ solution }) {
//   const [copied, setCopied] = useState(false);
//   const [shareOpen, setShareOpen] = useState(false);

//   const price = parseFloat(solution.price || 0);
//   const shareUrl = `https://www.rtu-solutions.me/solutions/${solution.id}-${slugify(solution.title)}`;

//   const handleCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//       setCopied(true);
//       toast.success("Link copy ho gaya!");
//       setTimeout(() => setCopied(false), 2000);
//     } catch {
//       toast.error("Copy nahi hua, dobara try karo");
//     }
//   };

//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: solution.title,
//           text: `Check out ${solution.title} on RTU Solutions`,
//           url: shareUrl,
//         });
//       } catch {
//         // user ne cancel kiya — ignore
//       }
//     } else {
//       setShareOpen((v) => !v);
//     }
//   };

//   const handleWhatsappShare = () => {
//     const text = encodeURIComponent(`${solution.title} - RTU Solutions\n${shareUrl}`);
//     window.open(`https://wa.me/?text=${text}`, "_blank");
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
//       <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

//         {/* PDF preview */}
//         <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
//           {solution.preview_blob_name ? (
//             <>
//               <iframe
//                 src={`/api/preview?id=${solution.id}`}
//                 className="w-full h-150"
//                 title="PDF preview"
//               />
//               {/* Disclaimer */}
//               <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border-t border-amber-100">
//                 <FiInfo size={14} className="text-amber-500 mt-0.5 shrink-0" />
//                 <p className="text-xs text-amber-700 leading-snug">
//                   यहाँ PDF के सिर्फ <span className="font-semibold">2 sample pages</span> दिखाए गए हैं — content और quality verify करने के लिए।
//                   पूरी PDF खरीदने के बाद उपलब्ध होगी।
//                 </p>
//               </div>
//             </>
//           ) : (
//             <div className="h-100 flex flex-col items-center justify-center text-gray-400">
//               <FiFileText size={28} className="mb-2" />
//               <p>Is solution ke liye preview available nahi hai</p>
//             </div>
//           )}
//         </div>

//         {/* Details + Buy + Share */}
//         <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-6">

//           <div className="flex items-start justify-between gap-2">
//             <h1 className="text-xl font-bold text-[#071A3D]">{solution.title}</h1>

//             {/* Share button */}
//             <div className="relative shrink-0">
//               <button
//                 onClick={handleNativeShare}
//                 className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition shrink-0"
//               >
//                 <FiShare2 size={15} className="text-gray-500" />
//               </button>

//               {/* Fallback share dropdown (desktop) */}
//               {shareOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
//                   <button
//                     onClick={() => { handleCopyLink(); setShareOpen(false); }}
//                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700"
//                   >
//                     {copied ? <FiCheck size={15} className="text-green-500" /> : <FiCopy size={15} />}
//                     {copied ? "Copied!" : "Copy link"}
//                   </button>
//                   <button
//                     onClick={() => { handleWhatsappShare(); setShareOpen(false); }}
//                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700 border-t border-gray-100"
//                   >
//                     <FaWhatsapp size={15} className="text-green-500" />
//                     Share on WhatsApp
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <p className="text-sm text-gray-400 mt-1">{solution.subject_name}</p>

//           {solution.description && (
//             <p className="text-sm text-gray-600 mt-3">{solution.description}</p>
//           )}

//           {/* Quick copy link row */}
//           <button
//             onClick={handleCopyLink}
//             className="mt-4 w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 hover:bg-gray-100 transition"
//           >
//             <span className="truncate">{shareUrl}</span>
//             {copied ? (
//               <FiCheck size={14} className="text-green-500 shrink-0" />
//             ) : (
//               <FiCopy size={14} className="shrink-0" />
//             )}
//           </button>

//           <div className="mt-6 pt-6 border-t">
//             {solution.is_premium ? (
//               <>
//                 <p className="text-2xl font-bold text-[#E8700A] mb-3">
//                   ₹{price.toFixed(0)}
//                 </p>
//                 <a
//                   href={`/checkout?solution_id=${solution.id}`}
//                   className="w-full inline-flex items-center justify-center gap-2 bg-[#071A3D] hover:bg-[#0d2a5e] text-white py-3 rounded-xl font-semibold transition"
//                 >
//                   <FiLock size={15} /> Buy & Download
//                 </a>
//               </>
//             ) : (
//               <a
//                 href={`/api/download?id=${solution.id}`}
//                 className="w-full inline-flex items-center justify-center gap-2 bg-[#E8700A] hover:bg-[#cf6209] text-white py-3 rounded-xl font-semibold transition"
//               >
//                 <FiDownload size={15} /> Download Free
//               </a>
//             )}

//             {solution.youtube_url && (
//               <a
//                 href={solution.youtube_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 py-3 rounded-xl font-semibold transition"
//               >
//                 <FaYoutube size={16} /> Watch Free Video
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiLock,
  FiDownload,
  FiFileText,
  FiShare2,
  FiCopy,
  FiCheck,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaWhatsapp, FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";

import { Document, Page, pdfjs } from "react-pdf";
import DOMPurify from "dompurify";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function slugify(text) {
  if (!text) return "";

  return String(text)
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .toLowerCase();
}

export default function SolutionDetailClient({ solution }) {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const [numPages, setNumPages] = useState(0);
  const [pdfError, setPdfError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);

  const [containerWidth, setContainerWidth] = useState(0);

  const previewRef = useRef(null);

  const price = parseFloat(solution.price || 0);

  const shareUrl =
    `https://www.rtu-solutions.me/solutions/` +
    `${solution.id}-${slugify(solution.title)}`;

  const previewUrl =
    `/api/preview?id=${solution.id}`;

  /*
   * Responsive PDF width
   */
  useEffect(() => {
    if (!previewRef.current) return;

    const element = previewRef.current;

    const updateWidth = () => {
      const width = element.clientWidth;

      if (width > 0) {
        setContainerWidth(width);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Copy link
   */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      toast.success("Link copy ho gaya!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Copy nahi hua, dobara try karo");
    }
  };

  /*
   * Native share
   */
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: solution.title,
          text: `Check out ${solution.title} on RTU Solutions`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      setShareOpen((value) => !value);
    }
  };

  /*
   * WhatsApp share
   */
  const handleWhatsappShare = () => {
    const text = encodeURIComponent(
      `${solution.title} - RTU Solutions\n${shareUrl}`
    );

    window.open(
      `https://wa.me/?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
   * PDF loaded
   */
  const handlePdfLoadSuccess = ({ numPages }) => {
    setNumPages(Math.min(numPages, 2));
    setPdfLoading(false);
    setPdfError(false);
  };

  /*
   * PDF error
   */
  const handlePdfLoadError = () => {
    setPdfLoading(false);
    setPdfError(true);
  };

  /*
   * Safe HTML description
   *
   * Admin description can contain:
   * <h3>
   * <p>
   * <ul>
   * <li>
   * <strong>
   * <br>
   */
  const safeDescription = solution.description
    ? DOMPurify.sanitize(solution.description, {
        USE_PROFILES: {
          html: true,
        },
      })
    : "";

  return (
    <main className="min-h-screen bg-gray-50 py-5 sm:py-8 lg:py-10 px-3 sm:px-5 lg:px-6">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7">

          {/* =====================================================
              PDF PREVIEW
          ====================================================== */}

          <section className="lg:col-span-2 min-w-0">

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

              {/* Preview header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100">

                <div className="flex items-center gap-2 min-w-0">
                  <FiFileText
                    size={17}
                    className="text-[#E8700A] shrink-0"
                  />

                  <span className="text-sm font-semibold text-[#071A3D] truncate">
                    Preview
                  </span>
                </div>

                {numPages > 0 && (
                  <span className="text-xs text-gray-400 shrink-0">
                    {numPages} sample {numPages === 1 ? "page" : "pages"}
                  </span>
                )}
              </div>

              {/* PDF area */}
              <div
                ref={previewRef}
                className="w-full bg-gray-100 p-2 sm:p-4"
              >

                {solution.preview_blob_name ? (

                  <div className="w-full">

                    {pdfLoading && (
                      <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-400">

                        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#E8700A] rounded-full animate-spin mb-3" />

                        <p className="text-sm">
                          Loading preview...
                        </p>

                      </div>
                    )}

                    {pdfError && (
                      <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-400">

                        <FiFileText
                          size={32}
                          className="mb-3"
                        />

                        <p className="text-sm text-center">
                          Preview load nahi ho paya.
                        </p>

                      </div>
                    )}

                    {!pdfError && (
                      <Document
                        file={previewUrl}
                        onLoadSuccess={handlePdfLoadSuccess}
                        onLoadError={handlePdfLoadError}
                        loading={null}
                      >

                        {Array.from(
                          { length: numPages },
                          (_, index) => (
                            <div
                              key={index}
                              className="w-full flex justify-center mb-3 last:mb-0"
                            >

                              <div className="bg-white shadow-sm rounded-sm overflow-hidden max-w-full">

                                <Page
                                  pageNumber={index + 1}
                                  width={
                                    containerWidth > 20
                                      ? Math.min(
                                          containerWidth,
                                          850
                                        )
                                      : undefined
                                  }
                                  renderTextLayer={false}
                                  renderAnnotationLayer={false}
                                  loading={
                                    <div className="w-full min-h-[300px] flex items-center justify-center text-gray-400">
                                      <span className="text-sm">
                                        Loading page...
                                      </span>
                                    </div>
                                  }
                                />

                              </div>

                            </div>
                          )
                        )}

                      </Document>
                    )}

                  </div>

                ) : (

                  <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-400">

                    <FiFileText
                      size={30}
                      className="mb-3"
                    />

                    <p className="text-sm">
                      Is solution ke liye preview available nahi hai
                    </p>

                  </div>

                )}

              </div>

              {/* Disclaimer */}
              {solution.preview_blob_name && (
                <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border-t border-amber-100">

                  <FiInfo
                    size={14}
                    className="text-amber-500 mt-0.5 shrink-0"
                  />

                  <p className="text-xs text-amber-700 leading-relaxed">
                    PDF ke sirf{" "}
                    <span className="font-semibold">
                      2 sample pages
                    </span>{" "}
                    preview ke liye dikhaye gaye hain.
                    Complete file purchase ke baad available hogi.
                  </p>

                </div>
              )}

            </div>

          </section>

          {/* =====================================================
              DETAILS / BUY
          ====================================================== */}

          <aside className="min-w-0">

            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 lg:p-6 shadow-sm lg:sticky lg:top-6">

              {/* Title + Share */}
              <div className="flex items-start justify-between gap-3">

                <h1 className="text-lg sm:text-xl font-bold leading-snug text-[#071A3D] break-words">
                  {solution.title}
                </h1>

                {/* Share */}
                <div className="relative shrink-0">

                  <button
                    type="button"
                    onClick={handleNativeShare}
                    aria-label="Share solution"
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition"
                  >
                    <FiShare2
                      size={15}
                      className="text-gray-500"
                    />
                  </button>

                  {shareOpen && (
                    <div className="absolute right-0 top-11 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

                      <button
                        type="button"
                        onClick={() => {
                          handleCopyLink();
                          setShareOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700"
                      >
                        {copied ? (
                          <FiCheck
                            size={15}
                            className="text-green-500"
                          />
                        ) : (
                          <FiCopy size={15} />
                        )}

                        {copied ? "Copied!" : "Copy link"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleWhatsappShare();
                          setShareOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700 border-t border-gray-100"
                      >
                        <FaWhatsapp
                          size={15}
                          className="text-green-500"
                        />

                        Share on WhatsApp
                      </button>

                    </div>
                  )}

                </div>

              </div>

              {/* Subject */}
              {solution.subject_name && (
                <p className="text-sm text-gray-400 mt-1">
                  {solution.subject_name}
                </p>
              )}

              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              {safeDescription && (
                <div
                  className="
                    solution-description
                    mt-4
                    text-sm
                    text-gray-600
                    leading-6
                    break-words
                  "
                  dangerouslySetInnerHTML={{
                    __html: safeDescription,
                  }}
                />
              )}

              {/* Copy URL */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="mt-5 w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 hover:bg-gray-100 transition"
              >

                <span className="truncate text-left">
                  {shareUrl}
                </span>

                {copied ? (
                  <FiCheck
                    size={14}
                    className="text-green-500 shrink-0"
                  />
                ) : (
                  <FiCopy
                    size={14}
                    className="shrink-0"
                  />
                )}

              </button>

              {/* =================================================
                  BUY / DOWNLOAD
              ================================================== */}

              <div className="mt-5 pt-5 border-t border-gray-100">

                {solution.is_premium ? (

                  <>

                    <p className="text-2xl font-bold text-[#E8700A] mb-3">
                      ₹{price.toFixed(0)}
                    </p>

                    <a
                      href={`/checkout?solution_id=${solution.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#071A3D] hover:bg-[#0d2a5e] active:bg-[#05132c] text-white py-3 rounded-xl font-semibold transition"
                    >
                      <FiLock size={15} />
                      Buy & Download
                    </a>

                  </>

                ) : (

                  <a
                    href={`/api/download?id=${solution.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#E8700A] hover:bg-[#cf6209] active:bg-[#b95507] text-white py-3 rounded-xl font-semibold transition"
                  >
                    <FiDownload size={15} />
                    Download Free
                  </a>

                )}

                {/* YouTube */}
                {solution.youtube_url && (
                  <a
                    href={solution.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 py-3 rounded-xl font-semibold transition"
                  >
                    <FaYoutube size={16} />
                    Watch Free Video
                  </a>
                )}

              </div>

            </div>

          </aside>

        </div>

      </div>

      {/* =========================================================
          DESCRIPTION STYLES
      ========================================================== */}

      <style jsx global>{`

        .solution-description h1,
        .solution-description h2,
        .solution-description h3,
        .solution-description h4 {
          color: #071A3D;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .solution-description h3 {
          font-size: 1rem;
        }

        .solution-description h4 {
          font-size: 0.95rem;
        }

        .solution-description p {
          margin: 0.5rem 0;
        }

        .solution-description ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin: 0.6rem 0;
        }

        .solution-description ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin: 0.6rem 0;
        }

        .solution-description li {
          margin: 0.25rem 0;
        }

        .solution-description strong {
          color: #071A3D;
          font-weight: 600;
        }

        .solution-description a {
          color: #E8700A;
          text-decoration: underline;
          overflow-wrap: anywhere;
        }

        .solution-description br {
          line-height: 1.5;
        }

        @media (max-width: 640px) {

          .solution-description {
            font-size: 13px;
            line-height: 1.55;
          }

          .solution-description h3 {
            font-size: 15px;
          }

        }

      `}</style>
    </main>
  );
}