import { 
  createRootRoute, 
  createRoute, 
  createRouter,
  RouterProvider,
  Outlet
} from '@tanstack/react-router'
import { StrictMode, Suspense, useEffect } from 'react'

// 导入页面组件
import App from './App'
import { createMemoryHistory, createBrowserHistory } from '@tanstack/react-router'

// 声明全局 Window 类型扩展
declare global {
  interface Window {
    routerDevtools?: any;
    __TANSTACK_ROUTER_STATE__?: any;
  }
}

// 创建根路由
const rootRoute = createRootRoute({
  component: () => (
    <div className="app-container">
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
})

// 创建首页路由
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

// 创建路由树
const routeTree = rootRoute.addChildren([indexRoute])

// 创建服务端路由实例
export function createServerRouter({ url }: { url: string }) {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createMemoryHistory({
      initialEntries: [url],
    })
  })
}

// 创建客户端路由实例
export function createBrowserRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createBrowserHistory()
  })
}

// 渲染客户端路由
export function ClientRouter() {
  // 在客户端创建路由
  const router = createBrowserRouter()

  useEffect(() => {
    // 如果存在路由状态，更新路由
    if (typeof window !== 'undefined' && window.__TANSTACK_ROUTER_STATE__) {
      const state = window.__TANSTACK_ROUTER_STATE__;
      if (state.location && state.location.pathname) {
        // 使用 navigate 方法将路由器导航到初始 URL
        router.navigate({
          to: state.location.pathname,
          search: state.location.search,
          replace: true
        });
      }
    }
  }, [router]);
  
  // 在开发环境加载开发工具
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    import('@tanstack/router-devtools').then((devtools) => {
      window.routerDevtools = devtools
    })
  }
  
  return (
    <StrictMode>
      <RouterProvider router={router} />
      {import.meta.env.DEV && typeof window !== 'undefined' && window.routerDevtools ? (
        <div className="tanstack-router-devtools">
          {/* 开发工具将在全局对象上可用 */}
        </div>
      ) : null}
    </StrictMode>
  )
}
