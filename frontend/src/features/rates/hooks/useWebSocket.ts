import { useEffect, useRef, useState } from 'react'
import type { ConnectionState, RateUpdate, MarketCommentary } from '@crypto/shared'
import { SOCKET_EVENTS } from '@crypto/shared'
import { createWebSocketClient } from '@lib/websocket/WebSocketClient'
import type { WebSocketClient } from '@lib/websocket/WebSocketClient'
import { useRatesStore } from '../store/rates.store'
import { useCommentaryStore } from '@features/commentary/store/commentary.store'
import { logger } from '@lib/logger/frontend-logger'
import { WS_URL } from '@config/constants'

type UseWebSocketReturn = {
  readonly connectionState: ConnectionState
}

const useWebSocket = (): UseWebSocketReturn => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const clientRef = useRef<WebSocketClient | null>(null)
  const updateRate = useRatesStore((state) => state.updateRate)
  const setCommentary = useCommentaryStore((state) => state.setCommentary)

  useEffect((): (() => void) => {
    const client = createWebSocketClient({ url: WS_URL })
    clientRef.current = client

    client.onStateChange((state: ConnectionState): void => {
      setConnectionState(state)
      logger.info('websocket_state_change', { state })
    })

    client.on<RateUpdate>(SOCKET_EVENTS.RATE_UPDATE, (update: RateUpdate): void => {
      updateRate(update)
    })

    client.on<MarketCommentary>(
      SOCKET_EVENTS.COMMENTARY_UPDATE,
      (commentary: MarketCommentary): void => {
        setCommentary(commentary)
      },
    )

    client.connect()

    return (): void => {
      client.disconnect()
      clientRef.current = null
    }
  }, [updateRate, setCommentary])

  return { connectionState }
}

export { useWebSocket, type UseWebSocketReturn }
