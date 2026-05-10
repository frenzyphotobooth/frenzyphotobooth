module.exports = function (eleventyConfig) {
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
