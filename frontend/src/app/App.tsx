import { WebSocketProvider } from '@app/providers/WebSocketProvider'
import { DashboardPage } from '@pages/dashboard/DashboardPage'

const App = (): JSX.Element => (
  <WebSocketProvider>
    <DashboardPage />
  </WebSocketProvider>
)

export { App }
