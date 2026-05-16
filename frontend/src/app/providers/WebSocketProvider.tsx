import { createContext, useContext, type ReactNode, type JSX } from 'react'
import type { ConnectionState } from '@crypto/shared'
import { useWebSocket } from '@features/rates/hooks/useWebSocket'

type WebSocketContextValue = {
  readonly connectionState: ConnectionState
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

const useWebSocketContext = (): WebSocketContextValue => {
  const context = useContext(WebSocketContext)
  if (context === null) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider')
  }
  return context
}

type WebSocketProviderProps = {
  readonly children: ReactNode
}

const WebSocketProvider = ({ children }: WebSocketProviderProps): JSX.Element => {
  const { connectionState } = useWebSocket()
  return (
    <WebSocketContext.Provider value={{ connectionState }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export { WebSocketContext, WebSocketProvider, useWebSocketContext, type WebSocketContextValue, type WebSocketProviderProps }
