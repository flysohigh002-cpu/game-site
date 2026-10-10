/* 榮耀 Online｜同步首頁卡片、攻略列表及文章主標題 */
(function () {
  "use strict";
  const articles = window.ARTICLE_TITLES || {};
  const brand = "榮耀 Online";

  function getArticleIdFromPath(path) {
    const match = (path || "").match(/(?:^|\/)guide(\d+)\.html$/i);
    return match ? "guide" + match[1] : null;
  }

  function setMeta(selector, content, createAttrs) {
    let node = document.querySelector(selector);
    if (!node && createAttrs) {
      node = document.createElement("meta");
      Object.entries(createAttrs).forEach(([key, value]) => node.setAttribute(key, value));
      document.head.appendChild(node);
    }
    if (node) node.setAttribute("content", content);
  }

  function applyArticlePageTitle(id, title) {
    document.title = title + "｜" + brand;
    const description = title + "｜" + brand + " 遊戲攻略與資訊整理。";
    setMeta('meta[name="description"]', description, { name: "description" });
    setMeta('meta[property="og:title"]', document.title, { property: "og:title" });
    setMeta('meta[property="og:description"]', description, { property: "og:description" });
    setMeta('meta[name="twitter:title"]', document.title, { name: "twitter:title" });
    setMeta('meta[name="twitter:description"]', description, { name: "twitter:description" });
    const h1 = document.querySelector("main article h1, main h1, article h1, h1");
    if (h1) h1.textContent = title;
  }

  function setCardTitle(card, title, mode) {
    const target = card.querySelector(".guide-preview-title, .article-title");
    if (target) target.textContent = title;
    const link = card.matches("a") ? card : card.querySelector("a");
    if (link) {
      const prefix = mode === "preview" ? "查看攻略：" : "閱讀攻略：";
      link.setAttribute("aria-label", prefix + title);
    }
    const img = card.querySelector("img");
    if (img) img.setAttribute("alt", title + "封面");
  }

  // Article page: the H1 is the authoritative title, reflected in SEO/share title tags too.
  const currentId = getArticleIdFromPath(window.location.pathname);
  if (currentId && articles[currentId] && articles[currentId].title) {
    applyArticlePageTitle(currentId, articles[currentId].title);
  }

  // Homepage preview cards: identify each article by its guideN.jpg cover filename.
  document.querySelectorAll(".guide-preview-card").forEach((card) => {
    const img = card.querySelector("img");
    const src = img ? (img.getAttribute("src") || "") : "";
    const match = src.match(/guide(\d+)\.jpg(?:[?#].*)?$/i);
    if (!match) return;
    const id = "guide" + match[1];
    const item = articles[id];
    if (item && item.title) setCardTitle(card, item.title, "preview");
  });

  // Game guide listing cards: identify each article by the guideN.html link.
  document.querySelectorAll('a.article-card[href]').forEach((card) => {
    const href = card.getAttribute("href") || "";
    const id = getArticleIdFromPath(href.split(/[?#]/)[0]);
    const item = id && articles[id];
    if (item && item.title) setCardTitle(card, item.title, "listing");
  });
})();
