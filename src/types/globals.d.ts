// src/globals.d.ts

export { };

declare global {
    interface Window {
        wsClient: any; // Replace `any` with the actual type of `wsClient` if known
    }
}
