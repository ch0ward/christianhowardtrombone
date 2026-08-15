/**
 * Eleventy config — christianhowardtrombone.com
 *
 * Adopted at the start of Phase 2 so the header, footer, and nav live in one
 * file instead of being hand-copied across six pages. Deliberately minimal:
 * one plugin-free config, one layout, no CSS pipeline, no JS bundling. The
 * site still ships as plain HTML and one stylesheet.
 */
module.exports = function (eleventyConfig) {
  // Copied through untouched. Icons, CNAME, and _headers must land at the
  // site root, so they are copied without their `src/` prefix.
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy("src/*.png");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Rebuild when the stylesheet changes during `npm run serve`.
  eleventyConfig.addWatchTarget("src/styles.css");

  // YYYY-MM-DD, for <lastmod> in the sitemap.
  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
