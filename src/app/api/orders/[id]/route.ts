import { NextResponse } from "next/server";
import { getOrderStatus } from "@/lib/orders-store";
import { allow, clientIp } from "@/lib/rate-limit";

const ID = /^[A-Za-z]{2}-\d{5}$/;
const notFound = () => NextResponse.json({ field: "notFound", message: "Order not found." }, { status: 404 });

export async function GET(req: Request, ctx: RouteContext<"/api/orders/[id]">) {
  const id = (await ctx.params).id.trim();
  if (!ID.test(id)) return notFound();
  // Order numbers are short, so slow down anyone trying to guess them.
  if (!(await allow("track", clientIp(req), 30, 600))) {
    return NextResponse.json({ field: "tooMany", message: "Too many lookups. Try again in a few minutes." }, { status: 429 });
  }
  try {
    const status = await getOrderStatus(id);
    return status ? NextResponse.json(status, { headers: { "Cache-Control": "no-store" } }) : notFound();
  } catch (err) {
    console.error("[orders] Lookup failed:", err);
    return NextResponse.json({ field: "network", message: "Order lookup failed." }, { status: 500 });
  }
}
