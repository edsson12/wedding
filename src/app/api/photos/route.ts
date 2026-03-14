import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export async function GET() {
  const dir = path.join(process.cwd(), "public", "images", "gallery");

  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => {
        // Append mtime as cache-buster so replaced files are always fresh
        const mtime = fs.statSync(path.join(dir, f)).mtimeMs;
        return `/images/gallery/${f}?v=${Math.floor(mtime)}`;
      });
  } catch {
    files = [];
  }

  return NextResponse.json(files, {
    headers: { "Cache-Control": "no-store" },
  });
}
