import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { ConnectionState } from '@crypto/shared'
import { RECONNECT_DELAYS_MS } from '@config/constants'

type MessageHandler<T = unknown> = (data: T) => void
type ConnectionStateHandler = (state: ConnectionState) => void

type WebSocketClientState = {
  connectionState: ConnectionState
  reconnectAttempt: number
  isManualDisconnect: boolean
  socket: Socket | null
}

type WebSocketClient = {
  connect(): void
  disconnect(): void
  on<T = unknown>(event: string, handler: MessageHandler<T>): void
  off(event: string): void
  onStateChange(handler: ConnectionStateHandler): void
  getConnectionState(): ConnectionState
}

type WebSocketClientOptions = {
  readonly url: string
}

const createWebSocketClient = (options: WebSocketClientOptions): WebSocketClient => {
  const state: WebSocketClientState = {
    connectionState: 'connecting',
    reconnectAttempt: 0,
    isManualDisconnect: false,
    socket: null,
  }

  const handlers: Map<string, MessageHandler> = new Map()
  let onConnectionStateChange: ConnectionStateHandler | null = null

  const updateConnectionState = (newState: ConnectionState): void => {
    state.connectionState = newState
    onConnectionStateChange?.(newState)
  }

  const reattachHandlers = (socket: Socket): void => {
    handlers.forEach((handler, event) => socket.on(event, handler))
  }

  const scheduleReconnect = (): void => {
    const index = Math.min(state.reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)
    const delay = RECONNECT_DELAYS_MS[index] ?? 30_000
    setTimeout(() => connect(), delay)
    state.reconnectAttempt++
  }

  const handleConnect = (): void => {
    state.reconnectAttempt = 0
    updateConnectionState('connected')
    if (state.socket) reattachHandlers(state.socket)
  }

  const handleDisconnect = (): void => {
    updateConnectionState('disconnected')
    if (state.isManualDisconnect) return
    scheduleReconnect()
  }

  const handleConnectError = (): void => {
    scheduleReconnect()
  }

  const connect = (): void => {
    if (state.socket?.connected) return
    state.isManualDisconnect = false
    const socket = io(options.url, {
      autoConnect: false,
      transports: ['websocket'],
    })
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)
    state.socket = socket
    socket.connect()
  }

  const disconnect = (): void => {
    state.isManualDisconnect = true
    state.socket?.disconnect()
    state.socket = null
    updateConnectionState('disconnected')
  }

  const on = <T = unknown>(event: string, handler: MessageHandler<T>): void => {
    handlers.set(event, handler as MessageHandler)
    state.socket?.on(event, handler)
  }

  const off = (event: string): void => {
    handlers.delete(event)
    state.socket?.off(event)
  }

  const onStateChange = (handler: ConnectionStateHandler): void => {
    onConnectionStateChange = handler
  }

  const getConnectionState = (): ConnectionState => state.connectionState

  return { connect, disconnect, on, off, onStateChange, getConnectionState }
}

export {
  createWebSocketClient,
  type WebSocketClient,
  type WebSocketClientOptions,
  type MessageHandler,
  type ConnectionStateHandler,
}
