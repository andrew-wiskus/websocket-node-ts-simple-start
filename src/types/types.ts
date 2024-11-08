import type { WebSocket, WebSocketServer } from 'ws';

export interface PublicUserData {
    uuid: string
    username: string
}

export type PlayerUUID = string
export type MessageObject = { content: string, role: string, timestamp: number }

export interface ServerState {
    server: WebSocketServer,
    sockets: {
        [uuid: string]: WebSocket
    },
    userData: {
        [uuid: string]: PublicUserData
    },
    conversations: {
        [uuid: string]: {
            messages: MessageObject[]
        }
    },
    counter: number
}