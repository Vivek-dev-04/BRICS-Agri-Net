import { NextResponse } from "next/server";
import { DEFAULT_FARMER_POSTS, StoredFarmerPost } from "@/lib/db/localStorageDb";

// In-memory runtime cache for server-side requests
let serverPosts: StoredFarmerPost[] = [...DEFAULT_FARMER_POSTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let filtered = [...serverPosts];

  if (country && country !== "ALL") {
    filtered = filtered.filter((p) => p.country === country);
  }

  if (category && category !== "ALL") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.cropFocus.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    posts: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.content || !body.authorName || !body.country) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (authorName, country, title, content)" },
        { status: 400 }
      );
    }

    const newPost: StoredFarmerPost = {
      id: `post-${Date.now().toString().slice(-6)}`,
      authorName: String(body.authorName).trim(),
      country: body.country,
      region: body.region || "Agricultural Zone",
      cropFocus: body.cropFocus || "Mixed Field Crops",
      category: body.category || "Regenerative",
      title: String(body.title).trim(),
      content: String(body.content).trim(),
      cadRefId: body.cadRefId || undefined,
      upvotes: 0,
      userUpvoted: false,
      comments: [],
      tags: Array.isArray(body.tags) ? body.tags : ["FarmerCommons"],
      metrics: body.metrics || undefined,
      createdAt: new Date().toISOString(),
    };

    serverPosts.unshift(newPost);

    return NextResponse.json({
      success: true,
      message: "Field practice published to BRICS Farmer Commons",
      post: newPost,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid post payload" },
      { status: 500 }
    );
  }
}
