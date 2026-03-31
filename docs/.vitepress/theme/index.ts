import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 图片放大功能 - 使用 medium-zoom (仅在客户端)
    if (typeof window !== 'undefined') {
      import('medium-zoom').then(({ default: mediumZoom }) => {
        const initZoom = () => {
          mediumZoom('[data-zoomable]', {
            margin: 24,
            background: 'rgba(0, 0, 0, 0.8)',
            scroll: false
          })
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initZoom)
        } else {
          initZoom()
        }

        // 监听路由变化，重新绑定
        window.addEventListener('hashchange', () => {
          setTimeout(initZoom, 100)
        })
      })
    }
  }
}