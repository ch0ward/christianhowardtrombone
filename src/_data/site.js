module.exports = {
  url: "https://christianhowardtrombone.com",
  name: "Christian Howard",
  // Every page shares one social preview image. Swap here, not per page.
  ogImage: "/img/og.jpg",
  ogImageAlt: "Christian Howard holding a tenor trombone.",

  // The contact address, defined once. It appears on four pages — changing it
  // in one place is the whole point. To switch to christian@chtrombone.com,
  // edit this line only; nothing else references the address directly.
  //
  // Whichever address is used here has to actually receive mail. As of
  // 2026-08-14 the Porkbun forward is not set up and this address goes nowhere.
  email: "christian@christianhowardtrombone.com",
  // Nav links ship only when the page they point to exists. No placeholders.
  // Phase 2 order adds Recordings, then CV, then Research, as each gate clears.
  nav: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about/" },
    { label: "Teaching", url: "/teaching/" },
    { label: "Contact", url: "/contact/" },
  ],
};
