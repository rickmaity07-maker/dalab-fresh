import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Call after changing prices or products in Neon:
//   curl -X POST https://your-site/api/revalidate -H "Authorization: Bearer $REVALIDATE_SECRET"
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const ok = secret && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  revalidateTag("catalog", "max");
  return NextResponse.json({ revalidated: true });
}
