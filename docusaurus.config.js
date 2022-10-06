// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Web3企业级工程',
  tagline: 'Web3企业级工程',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  // favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nishuzumi', // Usually your GitHub org/user name.
  projectName: 'web3ee', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-36085609-4',
          anonymizeIP: true,
        },
      },
    ],
  ],
  themes:[
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image:'img/primary_banner.png',
      navbar: {
        title: 'Web3企业级工程',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/tinyLogo.png',
        // },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: '文档',
          },
          {
            href: 'https://github.com/nishuzumi/Web3-Enterprise-level-engineering',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      colorMode:{
        defaultMode:'dark',
        disableSwitch:true,
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: '文档',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '社交链接',
            items: [
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/vqRrQBge8S',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/BoxMrChen',
              },
            ],
          },
          {
            title: '捐赠',
            items: [
              {
                label: 'ETH：boxchen.eth',
                to:"https://etherscan.io/enslookup-search?search=boxchen.eth"
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Web3Box, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
