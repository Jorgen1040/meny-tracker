const withSvgr = require("@newhighsco/next-plugin-svgr");
module.exports = withSvgr({
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "bilder.ngdata.no"],
  },
  i18n: {
    locales: ["nb"],
    defaultLocale: "nb",
  },
  svgrOptions: {},
});
