import { Socket, Server } from 'socket.io';

export default function (io: Server) {
  const broadcastingNamespace = io.of('/broadcast');

  broadcastingNamespace.use(async (socket: Socket, next) => {
    const auth = socket.handshake.headers.authorization;
    if (auth) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  });

  broadcastingNamespace.on('connection', (socket: Socket) => {
    socket.on('error', (err: Error) => {
      socket.emit('error', { message: err.message });
      if (err.message === 'Unauthorized') {
        socket.disconnect();
      }
    });
  })

  return broadcastingNamespace;
}
