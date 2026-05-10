module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("withBase", (url, basePath = "") => {
    if (typeof url !== "string" || url.length === 0) return url;
    if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:")) {
      return url;
    }

    const normalizedBase = basePath && basePath !== "/" ? basePath.replace(/\/+$/, "") : "";
    if (!normalizedBase) return url;
    if (!url.startsWith("/")) return `${normalizedBase}/${url}`;
    return `${normalizedBase}${url}`;
  });

  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "js": "js" });
  eleventyConfig.addPassthroughCopy({ "styles": "styles" });
  eleventyConfig.addPassthroughCopy({ "styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "logo.png": "logo.png" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
