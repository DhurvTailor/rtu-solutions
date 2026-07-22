// import { NextResponse } from "next/server";
// import { getSolutions } from "../../../services/solutionService";
// // ⚠️ ADJUST THIS PATH ONLY: solutionService.js jahan actual me rakhi hai wahan tak ka sahi relative path daalo

// function escapeXml(str = "") {
//   return String(str)
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&apos;");
// }

// // Tumhare Notes.jsx wali slugify function, hubahu copy
// function slugify(text) {
//   if (!text) return "";
//   return text
//     .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
//     .replace(/[–—]/g, "-")
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-{2,}/g, "-")
//     .trim()
//     .replace(/^-|-$/g, "");
// }

// export async function GET() {
//   try {
//     const solutions = await getSolutions();
//     const baseUrl = "https://www.rtu-solutions.me";

//     // Sirf paid (premium) products bhejna hai — free wale Google Shopping ke liye "product" nahi maane jaate
//     const paidSolutions = solutions.filter(
//       (s) => s.is_premium === 1 || s.is_premium === true
//     );

//     const items = paidSolutions
//       .map((item) => {
//         const productUrl = `${baseUrl}/solutions/${item.id}-${slugify(item.title)}`;
//         const imageUrl = `${baseUrl}/api/thumbnail?id=${item.id}`;

//         // Agar kisi solution ka thumbnail hi nahi hai, use skip kar do
//         // (Google bina image ke product ko reject kar deta hai)
//         if (!item.thumbnail_blob_name) return "";

//         return `
//     <item>
//       <g:id>${item.id}</g:id>
//       <g:title>${escapeXml(item.title)}</g:title>
//       <g:description>${escapeXml(
//         item.description ||
//           `${item.subject_name} - ${item.solution_type} for RTU ${item.branch_name} students`
//       )}</g:description>
//       <g:link>${productUrl}</g:link>
//       <g:image_link>${imageUrl}</g:image_link>
//       <g:condition>new</g:condition>
//       <g:availability>in stock</g:availability>
//       <g:price>${Number(item.price).toFixed(2)} INR</g:price>
//       <g:identifier_exists>false</g:identifier_exists>
//       <g:shipping>
//         <g:country>IN</g:country>
//         <g:service>Digital Delivery</g:service>
//         <g:price>0.00 INR</g:price>
//       </g:shipping>
//       <g:google_product_category>Media &gt; Books</g:google_product_category>
//       <g:product_type>${escapeXml(item.branch_name)} &gt; Semester ${item.semester_number} &gt; ${escapeXml(item.subject_name)}</g:product_type>
//     </item>`;
//       })
//       .join("");

//     const xml = `<?xml version="1.0" encoding="UTF-8"?>
// <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
//   <channel>
//     <title>RTU Solutions - Study Materials</title>
//     <link>${baseUrl}</link>
//     <description>RTU Notes, PYQ Solutions and Study Materials</description>${items}
//   </channel>
// </rss>`;

//     return new NextResponse(xml, {
//       status: 200,
//       headers: { "Content-Type": "application/xml; charset=utf-8" },
//     });
//   } catch (error) {
//     console.error("Feed generation error:", error);
//     return new NextResponse("Error generating feed", { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import { getSolutions } from "../../../services/solutionService";
import { getCached, setCache } from "../../../lib/cache";   // 🆕 NEW LINE
// ⚠️ ADJUST THIS PATH ONLY: solutionService.js jahan actual me rakhi hai wahan tak ka sahi relative path daalo

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Tumhare Notes.jsx wali slugify function, hubahu copy
function slugify(text) {
  if (!text) return "";
  return text
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/[–—]/g, "-")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    const cached = getCached("product-feed-xml");                 // 🆕 NEW
    if (cached) {                                                   // 🆕 NEW
      return new NextResponse(cached, {                             // 🆕 NEW
        status: 200,                                                // 🆕 NEW
        headers: { "Content-Type": "application/xml; charset=utf-8" }, // 🆕 NEW
      });                                                            // 🆕 NEW
    }                                                                 // 🆕 NEW

    const solutions = await getSolutions();
    const baseUrl = "https://www.rtu-solutions.me";

    // Sirf paid (premium) products bhejna hai — free wale Google Shopping ke liye "product" nahi maane jaate
    const paidSolutions = solutions.filter(
      (s) => s.is_premium === 1 || s.is_premium === true
    );

    const items = paidSolutions
      .map((item) => {
        const productUrl = `${baseUrl}/solutions/${item.id}-${slugify(item.title)}`;
        const imageUrl = `${baseUrl}/api/thumbnail?id=${item.id}`;

        // Agar kisi solution ka thumbnail hi nahi hai, use skip kar do
        // (Google bina image ke product ko reject kar deta hai)
        if (!item.thumbnail_blob_name) return "";

        return `
    <item>
      <g:id>${item.id}</g:id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(
        item.description ||
          `${item.subject_name} - ${item.solution_type} for RTU ${item.branch_name} students`
      )}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${Number(item.price).toFixed(2)} INR</g:price>
      <g:identifier_exists>false</g:identifier_exists>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Digital Delivery</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
      <g:google_product_category>Media &gt; Books</g:google_product_category>
      <g:product_type>${escapeXml(item.branch_name)} &gt; Semester ${item.semester_number} &gt; ${escapeXml(item.subject_name)}</g:product_type>
    </item>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>RTU Solutions - Study Materials</title>
    <link>${baseUrl}</link>
    <description>RTU Notes, PYQ Solutions and Study Materials</description>${items}
  </channel>
</rss>`;

    setCache("product-feed-xml", xml, 21600);                        // 🆕 NEW (6hr)

    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    console.error("Feed generation error:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}