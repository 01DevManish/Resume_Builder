import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Puppeteer ko launch karna Vercel-friendly mode me
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(), // Vercel-compatible Chromium
      headless: chromium.headless as any, // Vercel lambda-friendly mode
    });

    const page = await browser.newPage();
    await page.setContent("<h1>Hello, Vercel PDF!</h1>");

    // PDF generate karo
    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    // PDF return karo
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      },
    });
  } catch (error) {
    return new NextResponse(`Error generating PDF: ${error}`, { status: 500 });
  }
}
