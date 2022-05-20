import { defineConfig } from "vitepress"

export default defineConfig({
  title: "Vue Auth 3",
  icon: "/icon.svg",
  description:
    "Plugin that inherits from @websanova/vue-auth brings great auth manager to vue 3!",
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/icon.svg" }]
  ],

  themeConfig: {
    logo: "/icon.svg",
    repo: "tachibana-shin/vue-auth3",
    docsDir: "docs",
    docsBranch: "master",
    editLinks: true,
    editLinkText: "Edit this page on Github",
    lastUpdated: "Last Updated",

    // algolia

    nav: [
      { text: "Guide", link: "/", activeMatch: "^/$|^/guide/" },
      {
        text: "Release Notes",
        link: "https://github.com/tachibana-shin/vue-auth3/releases",
      },
    ],

    sidebar: {
      "/guide/": getGuideSidebar(),
      "/config/": getConfigSidebar(),
      "/": getGuideSidebar(),
    },
  },
})

function getGuideSidebar() {
  return [
    {
      text: "Introduction",
      children: [
        { text: "What is VitePress?", link: "/introduction" },
        { text: "Getting Started", link: "/guide/getting-started" },
        { text: "Plugins", link: "/guide/plugins" },
        { text: "Drivers", link: "/guide/drivers" },
        { text: "Auth Meta", link: "/guide/auth-meta" },
        { text: "Requests", link: "/guide/requests" },
        { text: "OAuth2", link: "/guide/oauth2" },
        { text: "Token", link: "/guide/token" },
        { text: "Cookie", link: "/guide/cookie" },
      ],
    },
    {
      text: "Methods",
      children: [
        { text: "Overview", link: "/methods/overview" },
        { text: "Init", link: "/methods/init" },
        { text: "User Data", link: "/methods/user-data" },
        { text: "Login & Register", link: "/methods/register-and-login" },
        { text: "Impersonating", link: "/methods/impersonating" },
        { text: "Uttils", link: "/methods/utils" },
      ],
    },
    {
      text: "Config",
      children: [
        { text: "Core", link: "/options/core" },
        { text: "Base", link: "/options/options-generate" },
      ],
    },
  ]
}

function getConfigSidebar() {
  return [
    {
      text: "App Config",
      children: [{ text: "Basics", link: "/config/basics" }],
    },
    {
      text: "Theme Config",
      children: [
        { text: "Homepage", link: "/config/homepage" },
        { text: "Algolia Search", link: "/config/algolia-search" },
        { text: "Carbon Ads", link: "/config/carbon-ads" },
      ],
    },
  ]
}
