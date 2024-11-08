import { broadcast_message } from "./send_message.js";


export const on_socket_recieve_data = (webSocket: any, key: string, uuid: string, payload: any) => {
    // TODO: if (key == `connect`)  handleUserConnection(webSocket, uuid, payload);
    if (key === 'counter') {
        handle_counter_action(webSocket, payload);
    }
}

function handle_counter_action(webSocket: WebSocket, payload: any) {
    if (payload.action === 'increment') {
        global.state.counter++;
    } else if (payload.action === 'decrement') {
        global.state.counter--;
    }

    // Broadcast the new counter value to all connected clients
    broadcast_message('update_counter', { value: global.state.counter });
}