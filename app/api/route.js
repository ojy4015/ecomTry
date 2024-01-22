//each of API endpoints will be deployed  as a severless functions when we deploy to vercel

// localhost:3000/api
import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json({ time: new Date().toLocaleString() });
}