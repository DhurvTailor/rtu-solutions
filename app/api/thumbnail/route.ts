// import { NextRequest, NextResponse } from "next/server";
// import { getThumbnailURL } from "@/lib/azureBlob";
// import { getSolutionById } from "@/services/solutionService";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Solution id chahiye" },
//         { status: 400 }
//       );
//     }

//     const solution = await getSolutionById(id);

//     if (!solution || !solution.thumbnail_blob_name) {
//       return NextResponse.json(
//         { error: "Thumbnail nahi mili" },
//         { status: 404 }
//       );
//     }

//     const url = await getThumbnailURL(solution.thumbnail_blob_name);

//     // Redirect karo taaki <img src> directly kaam kare
//     return NextResponse.redirect(url);
//   } catch (error) {
//     console.error("Thumbnail error:", error);
//     return NextResponse.json(
//       { error: "Thumbnail load nahi ho paya" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { getThumbnailURL } from "@/lib/azureBlob";
import { getSolutionById } from "@/services/solutionService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Solution id chahiye" },
        { status: 400 }
      );
    }

    const solution = await getSolutionById(id);

    if (!solution || !solution.thumbnail_blob_name) {
      return NextResponse.json(
        { error: "Thumbnail nahi mili" },
        { status: 404 }
      );
    }

    const sasUrl = await getThumbnailURL(solution.thumbnail_blob_name);

    // Redirect karne ke bajaye, image ko yahin fetch karke bytes return karo
    // Isse /api/thumbnail?id=39 hamesha stable rahega, chahe Azure SAS token expire ho jaye
    const imageResponse = await fetch(sasUrl);

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Azure se image fetch nahi ho payi" },
        { status: 502 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // Content-Type detect karo blob ke actual response se, warna extension se guess karo
    let contentType = imageResponse.headers.get("content-type");
    if (!contentType || contentType === "application/octet-stream") {
      const filename = solution.thumbnail_blob_name.toLowerCase();
      if (filename.endsWith(".webp")) contentType = "image/webp";
      else if (filename.endsWith(".png")) contentType = "image/png";
      else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
      else contentType = "image/jpeg"; // fallback
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Vercel/CDN pe cache ho jaye, baar baar Azure hit na kare
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Thumbnail error:", error);
    return NextResponse.json(
      { error: "Thumbnail load nahi ho paya" },
      { status: 500 }
    );
  }
}