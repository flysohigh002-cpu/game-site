/* 榮耀 Online｜將 article-content.js 的集中內容同步至個別文章頁 */
(function () {
  "use strict";

  const match = (window.location.pathname || "").match(/(?:^|\/)guide(\d+)\.html$/i);
  if (!match) return;

  const articleId = "guide" + match[1];
  const item = (window.ARTICLE_CONTENT || {})[articleId];
  if (!item) return;

  const lead = document.querySelector("main .lead");
  const body = document.querySelector("main .content");

  if (lead && typeof item.lead === "string") {
    lead.textContent = item.lead.trim();
  }
  if (body && typeof item.body === "string") {
    body.innerHTML = item.body.trim();
  }

  // 同步摘要相關的 SEO / 社群描述，使用文章摘要而非固定通用描述。
  const summarySource = lead ? lead.textContent.trim() : "";
  if (summarySource) {
    const summary = summarySource.length > 160 ? summarySource.slice(0, 157) + "…" : summarySource;
    setMeta('meta[name="description"]', summary, { name: "description" });
    setMeta('meta[property="og:description"]', summary, { property: "og:description" });
    setMeta('meta[name="twitter:description"]', summary, { name: "twitter:description" });
  }

  function setMeta(selector, value, attrs) {
    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement("meta");
      Object.entries(attrs).forEach(([key, val]) => node.setAttribute(key, val));
      document.head.appendChild(node);
    }
    node.setAttribute("content", value);
  }
})();
