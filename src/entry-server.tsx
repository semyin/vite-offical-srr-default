import { renderToString } from 'react-dom/server'
import { StrictMode } from 'react'
import { createServerRouter } from './router'
import { RouterProvider } from '@tanstack/react-router'

export async function render(url: string) {
  // 创建服务端路由
  const router = createServerRouter({ url })
  
  // 将路由导航到指定 URL
  await router.navigate({ to: url })
  
  // 等待路由完全准备就绪
  await router.load()
  
  // 渲染页面
  const html = renderToString(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
  
  // 获取路由状态数据
  // 在新版 TanStack Router 中，router 实例可能没有直接的 serialize 方法
  // 我们将路由当前状态转换为字符串
  const dehydratedState = {
    location: router.state.location,
    matches: router.state.matches
  }
  
  // 构造脚本用于客户端脱水化
  const script = `window.__TANSTACK_ROUTER_STATE__ = ${JSON.stringify(dehydratedState).replace(/</g, '\\u003c')};`
  
  return { 
    html,
    head: `<script>${script}</script>` 
  }
}
