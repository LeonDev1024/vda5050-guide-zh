import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'VDA 5050 中文指南',
  description: 'VDA 5050 自动化导引车通信标准中文文档',
  lang: 'zh-CN',
  base: '/vda5050-guide-zh/',
  ignoreDeadLinks: true,
  themeConfig: {
    siteTitle: 'VDA 5050 中文指南',
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/docs/01-intro' },
      { text: '协议概述', link: '/docs/04-transport' },
      { text: 'GitHub', link: 'https://github.com/VDA5050/VDA5050' }
    ],
    sidebar: {
      '/': [
        {
          text: '概述',
          items: [
            { text: '简介', link: '/docs/01-intro' },
            { text: '范围与目标', link: '/docs/02-scope' },
            { text: '术语定义', link: '/docs/03-definitions' }
          ]
        },
        {
          text: '核心协议',
          items: [
            { text: '传输协议', link: '/docs/04-transport' },
            { text: '通信流程', link: '/docs/05-process' },
            { text: '订单协议', link: '/docs/06-order' },
            { text: '动作定义', link: '/docs/07-actions' }
          ]
        },
        {
          text: '数据模型',
          items: [
            { text: '地图', link: '/docs/08-maps' },
            { text: '区域', link: '/docs/09-zones' },
            { text: '连接', link: '/docs/10-connection' },
            { text: '状态', link: '/docs/11-state' }
          ]
        },
        {
          text: '高级特性',
          items: [
            { text: '可视化', link: '/docs/12-visualization' },
            { text: '信息单', link: '/docs/13-factsheet' },
            { text: '消息规格', link: '/docs/14-messages' }
          ]
        },
        {
          text: '示例与指南',
          items: [
            { text: '实现指南', link: '/docs/examples/implementation-guide' },
            { text: '调试与故障排除', link: '/docs/16-debugging' },
            { text: 'JSON 示例', link: '/docs/examples/order-full.json' }
          ]
        },
        {
          text: '参考',
          items: [
            { text: '术语表', link: '/docs/glossary' },
            { text: '常见问题', link: '/docs/faq' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/VDA5050/VDA5050' }
    ],
    footer: {
      message: '基于 VDA 5050 Version 3.0.0',
      copyright: 'MIT License'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3]
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ]
})