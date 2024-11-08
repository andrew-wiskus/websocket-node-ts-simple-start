

// client.ts
interface ServerMessage {
    key: string;
    payload: any;
}

interface CounterPayload {
    action: 'increment' | 'decrement';
}

class WebSocketClient {
    private ws: WebSocket;
    private statusDiv: HTMLDivElement;
    private counterDiv: HTMLDivElement;
    private count: number = 0;

    constructor() {
        const HOST = window.location.hostname;
        const PORT = window.location.port;

        const statusElement = document.getElementById('status');
        const counterElement = document.getElementById('counter');

        if (!statusElement || !counterElement) {
            throw new Error('Required elements not found');
        }

        this.statusDiv = statusElement as HTMLDivElement;
        this.counterDiv = counterElement as HTMLDivElement;

        this.ws = new WebSocket(`ws://${HOST}:${PORT}`);
        this.setupWebSocket();
    }

    private setupWebSocket(): void {
        this.ws.onopen = this.handleServerConnected.bind(this);
        this.ws.onmessage = this.handleRecievedMessage.bind(this);
        this.ws.onclose = this.handleServerDisconnected.bind(this);
        this.ws.onerror = this.handleError.bind(this);
    }

    private handleServerConnected(): void {
        this.statusDiv.textContent = 'Connected!';
        this.statusDiv.style.color = 'green';

        this.ws.send(JSON.stringify({
            key: 'connect',
            uuid: 'user-' + Math.random().toString(36).substr(2, 9),
            payload: { message: 'Hello server!' }
        }));
    }

    private handleServerDisconnected(): void {
        this.statusDiv.textContent = 'Disconnected';
        this.statusDiv.style.color = 'red';
    }

    private handleError(event: Event): void {
        this.statusDiv.textContent = 'Error: ' + event.type;
        this.statusDiv.style.color = 'red';
    }

    private handleRecievedMessage(event: MessageEvent): void {
        const eventData = JSON.parse(event.data) as ServerMessage;
        const { key, payload } = eventData

        if (key == 'update_counter') {
            const data = payload as { value: number };
            this.count = data.value;
            this.counterDiv.textContent = this.count.toString();
        }
    }

    private sendWebsocketPayload<T>(key: string, payload: T): void {
        this.ws.send(JSON.stringify({
            key: key,
            payload: payload
        }));
    }

    public updateCounter(is_inc: boolean): void {
        this.sendWebsocketPayload<{ action: 'increment' | 'decrement' }>('counter', { action: is_inc ? 'increment' : 'decrement' });
    }
}

const wsClient = new WebSocketClient();
window.wsClient = wsClient;