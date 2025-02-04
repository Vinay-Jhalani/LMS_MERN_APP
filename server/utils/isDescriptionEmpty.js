import { JSDOM } from "jsdom";

export const isDescriptionEmpty = (htmlContent) => {
  // Parse the HTML content
  const dom = new JSDOM(htmlContent);
  const textContent = dom.window.document.body.textContent || "";

  // Trim and check if empty
  return !(textContent.trim() === "");
};
