import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'WeiMD 帮助中心',
  description: 'WeiMD - 更优雅的 Markdown 公众号排版工具',
  base: '/docs/',
  
  // 开发服务器端口配置
  port: 8080,

  theme: defaultTheme({
    logo: 'https://weimd.gudong.site/favicon-light.svg',
    repo: 'maoruibin/WeiMD',
    docsDir: 'apps/docs/src',
    
    navbar: [
      {
        text: '去创作',
        link: 'https://weimd.gudong.site',
      },
    ],
    
    sidebar: {
      '/': [
        {
          text: '入门教程',
          children: [
            '/guide/quick-start-user.md',
            '/guide/developer-quickstart.md',
          ],
        },
        {
          text: '操作指南',
          children: [
            '/guide/image-hosting.md',
            '/guide/themes.md',
          ],
        },
        {
          text: '技术参考',
          children: [
            '/reference/shortcuts.md',
            '/reference/project-structure.md',
            '/reference/dark-mode-algorithm.md',
          ],
        },
        {
          text: '关于',
          children: [
            '/about/intro.md',
            '/about/changelog.md',
            '/about/faq.md',
          ],
        },
      ],
    },
  }),
})
