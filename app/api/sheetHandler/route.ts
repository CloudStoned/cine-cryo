import sheetHandler from "./sheetHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await sheetHandler(body);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
  }
}
