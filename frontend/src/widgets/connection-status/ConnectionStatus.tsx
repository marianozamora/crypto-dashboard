import { Badge } from '@atoms/Badge'
import { useWebSocketContext } from '@app/providers/WebSocketProvider'

const ConnectionStatus = (): JSX.Element => {
  const { connectionState } = useWebSocketContext()
  return (
    <div data-testid="connection-status">
      <Badge variant={connectionState} />
    </div>
  )
}

export { ConnectionStatus }
