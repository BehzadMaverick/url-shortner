import broadcastingNamespace from '../namespaces/broadcastingNamespace';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

type socketData<T> = {
  socket: Socket,
  queue: Array<T>
}

type queueType = {
    messageId: string,
    message: { shortenedURL: string },
    timestamp: number
}

const connectedUsers: Map<string, socketData<queueType>> = new Map();

export default function setupBroadcastingRoom(io: Server) {
  const namespace = broadcastingNamespace(io);
  const chatRoom = namespace.to('broadcasting-room');

  namespace.on('connection', (socket: Socket) => {
    console.log('connected');
    socket.join('broadcasting-room');

    if (socket.handshake.headers.authorization)
      connectedUsers.set(socket.handshake.headers.authorization, {socket: socket, queue: []});

    socket.on('disconnect', () => {
      if (socket.handshake.headers.authorization)
        connectedUsers.delete(socket.handshake.headers.authorization);
    });

    socket.on('acknowledge', ({ messageId }) => {
      const userKey = socket.handshake.headers.authorization;

      if (!userKey)
        return;

      if (!messageId)
        return;
      
      const socketData = connectedUsers.get(userKey);

      if (!socketData)
        return;
      
      socketData.queue = socketData.queue.filter((obj: queueType) => {
        return obj.messageId != messageId;
      })
      
    })
  });

  return chatRoom;
}

export function sendUrlResponse(shortenedUrl: string, userKey: string, setAck?: string | null) {
  const socketData = connectedUsers.get(userKey);
  if (!socketData)
    return;

  const message = { shortenedURL: shortenedUrl };
  const messageId = setAck ?? v4();
  const timestamp = Date.now();
  socketData.socket?.emit('url-response', {message, messageId});

  if (setAck) {
    const queueItem = socketData.queue.find((obj: queueType) => {
      return messageId === obj.messageId
    })

    if (queueItem)
      queueItem.timestamp = timestamp;
  }
  else
    socketData.queue.push({
      message,
      messageId,
      timestamp
    })
  
  setTimeout(() => {
    const queueItem = socketData.queue.find((obj: queueType) => {
      return messageId === obj.messageId
    })

    if (queueItem) {
      sendUrlResponse(message.shortenedURL, userKey, queueItem.messageId);
    }
  }, 5000)
}
