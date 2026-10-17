import { NextResponse } from "next/server";
import { getOrderStatus } from "@/lib/orders-store";

export async function GET(_req: Request, ctx: RouteContext<"/api/orders/[id]">) {
  const { id } = await ctx.params;
  if (!/^[A-Za-z]{2}-\d{5}$/.test(id.trim())) {
    return NextResponse.json({ field: "notFound", message: `No order ${id.toUpperCase()} found.` }, { status: 404 });
  }
  try {
    const status = await getOrderStatus(id);
    if (!status) return NextResponse.json({ field: "notFound", message: `No order ${id.toUpperCase()} found.` }, { status: 404 });
    return NextResponse.json(status);
  } catch (err) {
    console.error("[orders] Lookup failed:", err);
    return NextResponse.json({ field: "network", message: "Order lookup failed." }, { status: 500 });
  }
}
