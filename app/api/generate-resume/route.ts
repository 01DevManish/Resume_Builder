import puppeteer from "puppeteer-core";
import { NextRequest, NextResponse } from "next/server";
import os from "os";


export async function POST(req: NextRequest) {
  const body = await req.json();

  // Set Chromium path based on OS
  let chromiumPath = "";
  if (os.platform() === "win32") {
    chromiumPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; // Windows
  } else if (os.platform() === "darwin") {
    chromiumPath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; // Mac
  } else {
    chromiumPath = "/usr/bin/chromium-browser"; // Linux
  }

  const browser = await puppeteer.launch({
    executablePath: chromiumPath, // Use the correct Chromium path
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(``);
  const pdf = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    },
  });
}
