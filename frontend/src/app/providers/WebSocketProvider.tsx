import { createContext, useContext, type ReactNode } from 'react'
import type { ConnectionState } from '@crypto/shared'

type WebSocketContextValue = {
  connectionState: ConnectionState
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

const useWebSocketContext = (): WebSocketContextValue => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider')
  }
  return context
}

type WebSocketProviderProps = {
  children: ReactNode
}

const WebSocketProvider = ({ children }: WebSocketProviderProps): JSX.Element => (
  <WebSocketContext.Provider value={{ connectionState: 'connecting' }}>
    {children}
  </WebSocketContext.Provider>
)

export { WebSocketProvider, useWebSocketContext, type WebSocketContextValue }
