import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'VDA 5050 中文指南',
  description: 'VDA 5050 自动化导引车通信标准中文文档',
  lang: 'zh-CN',
  base: '/vda5050-guide-zh/',
  ignoreDeadLinks: true,
  themeConfig: {
    siteTitle: 'VDA 5050 中文指南',
    outlineTitle: '目录',
    // 侧边栏可收起
    sidebar: {
      '/': [
        {
          text: '概述',
          collapsed: false,
          items: [
            { text: '简介', link: '/01-intro' },
            { text: '范围与目标', link: '/02-scope' },
            { text: '术语定义', link: '/03-definitions' }
          ]
        },
        {
          text: '核心协议',
          collapsed: false,
          items: [
            { text: '传输协议', link: '/04-transport' },
            { text: '通信流程', link: '/05-process' },
            { text: '订单协议', link: '/06-order' },
            { text: '动作定义', link: '/07-actions' }
          ]
        },
        {
          text: '数据模型',
          collapsed: false,
          items: [
            { text: '地图', link: '/08-maps' },
            { text: '区域', link: '/09-zones' },
            { text: '连接', link: '/10-connection' },
            { text: '状态', link: '/11-state' }
          ]
        },
        {
          text: '高级特性',
          collapsed: false,
          items: [
            { text: '可视化', link: '/12-visualization' },
            { text: '信息单', link: '/13-factsheet' },
            { text: '消息规格', link: '/14-messages' }
          ]
        },
        {
          text: '示例与指南',
          collapsed: false,
          items: [
            { text: '实现指南', link: '/examples/implementation-guide' },
            { text: '调试与故障排除', link: '/16-debugging' },
            { text: 'JSON 示例', link: '/examples/order-full.json' }
          ]
        },
        {
          text: '参考',
          collapsed: false,
          items: [
            { text: '术语表', link: '/glossary' },
            { text: '常见问题', link: '/faq' }
          ]
        }
      ]
    },
    // 隐藏侧边栏按钮
    hideSidebar: true,
    // 缩小右侧大纲
    outline: {
      level: [2, 3],
      label: '目录'
    },
    // 导航栏配置
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/01-intro' },
      { text: '协议概述', link: '/04-transport' },
      { text: 'GitHub', link: 'https://github.com/VDA5050/VDA5050' }
    ],
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