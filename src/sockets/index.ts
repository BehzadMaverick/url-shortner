import { Server } from "socket.io";
import setupBroadcastingRoom from "./rooms/broadcastingRoom";

export default class Socket{
    static io: Server
    constructor(io: Server) {
        Socket.io = io
    }
    initializeSocket() {
        setupBroadcastingRoom(Socket.io)
    }
}
