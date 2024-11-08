import dotenv from 'dotenv'
import express from 'express';
import * as http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';
import { ServerState } from './types/types.js';
import { on_socket_recieve_data } from './websockets/on_socket_recieve_data.js';
declare global { var state: ServerState; }

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.state = { server: webSocketServer, sockets: {}, userData: {}, conversations: {}, counter: 0 };
dotenv.config();

app.use((req, res, next) => {
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

const staticPath = path.join(__dirname, '..', 'dist', 'public');
app.use(express.static(staticPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'public', 'index.html'));
});

webSocketServer.on('connection', (webSocket: WebSocket) => {
    console.log('-- starting sockets -- uwu --');

    webSocket.on('message', (message: string) => {
        try {
            const data = JSON.parse(message.toString()) as any;
            const { key, uuid, payload } = data;
            on_socket_recieve_data(webSocket, key, uuid, payload)
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    webSocket.on('close', () => {
        // ~ handle_user_disconnect(webSocket);
    });
});



server.listen(PORT, () => {
    console.log(`\n- Server started at http://${HOST}:${PORT}`);
    console.log(`- WebSocket URL: ws://${HOST}:${PORT}`);
});