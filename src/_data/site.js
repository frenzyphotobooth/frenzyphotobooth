const isProduction = process.env.ELEVENTY_ENV === "production";
const hasSiteBasePath = Object.prototype.hasOwnProperty.call(process.env, "SITE_BASE_PATH");
const configuredBasePath = hasSiteBasePath ? (process.env.SITE_BASE_PATH || "").trim() : null;

module.exports = {
  basePath: configuredBasePath !== null ? configuredBasePath : (isProduction ? "/frenzy-photobooth" : ""),
  brand: {
    name: "Frenzy",
    accent: "Photobooth",
    logoSrc: "/logo.png",
    logoAlt: "Frenzy Photobooth",
    tagline: "Making every event unforgettable, one photo at a time, and creating lifetime moments every time.",
  },
  navigation: {
    links: [
      { label: "Home", href: "/#home" },
      { label: "About Us", href: "/#about" },
      { label: "Services", href: "/#services" },
      { label: "Gallery", href: "/#gallery" },
      { label: "Reviews", href: "/#testimonials" },
    ],
    cta: { label: "Get a Quote", href: "/get-quote" },
    themeToggleAriaLabel: "Toggle light/dark theme",
    mobileMenuAriaLabel: "Toggle navigation menu",
  },
  footer: {
    quickLinksTitle: "Quick Links",
    quickLinks: [
      { label: "Home", href: "/#home" },
      { label: "About Us", href: "/#about" },
      { label: "Packages", href: "/#services" },
      { label: "Gallery", href: "/#gallery" },
      { label: "Get a Quote", href: "/get-quote" },
    ],
    contactTitle: "Contact Us",
    contactItems: [
      "info.frenzyphotobooth@gmail.com",
      "(720) 255-1369",
    ],
    socialLinks: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/info.frenzyphotobooth?igsh=MTFmMTd1bnpsOGRzeA==",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61589202503694",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@frenzyphotobooth?_r=1&_t=ZT-95xYNk1v9m1",
      },
    ],
    copyright: "© 2025 Frenzy Photobooth. All rights reserved.",
  },
};
