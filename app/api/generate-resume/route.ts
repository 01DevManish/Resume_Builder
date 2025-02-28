import puppeteer from 'puppeteer-core';
import { NextRequest, NextResponse } from 'next/server';
import chrome from 'chrome-aws-lambda';  // Ensure correct path

export async function POST(req: NextRequest) {
  const body = await req.json();

  const browser = await puppeteer.launch({
    executablePath: await chrome.executablePath,  // Ensure correct executable path for serverless
    args: chrome.args,  // Args optimized for serverless
    headless: chrome.headless,  // Ensure headless mode
  });

  const page = await browser.newPage();
  await page.setContent(`<h1>${body.profile.name} - Resume</h1>`);
  const pdf = await page.pdf({ format: 'A4', printBackground: true });

  await browser.close();

  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
    },
  });
}
