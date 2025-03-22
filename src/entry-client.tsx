import './index.css'
import { hydrateRoot } from 'react-dom/client'
import { ClientRouter } from './router'

// 使用 TanStack Router 的客户端路由组件替代原来的 App 组件
hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <ClientRouter />,
  {
    onCaughtError: (error, context) => {
      console.error(error)
      console.log(context);
      
    },
    onRecoverableError: (error) => {
      console.error(error)
    }
  }
)
