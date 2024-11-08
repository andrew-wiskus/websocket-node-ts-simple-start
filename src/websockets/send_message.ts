export function send_message(webSocket: WebSocket, key: string, payload: any = {}) {
    if (!webSocket || webSocket.readyState !== webSocket.OPEN) {
        console.error("trying to send message to a dead socket.... :|", { key, payload });
        return;
    }

    webSocket.send(JSON.stringify({ key, payload }));
}

export function broadcast_message(key: string, payload: any) {
    global.state.server.clients.forEach((client) => {
        send_message(client as any, key, payload);
    });
}