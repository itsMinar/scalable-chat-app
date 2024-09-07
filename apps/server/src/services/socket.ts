import { Server } from 'socket.io';

class SocketService {
  private _io: Server;

  constructor() {
    console.log('Init Socket Server...');

    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*',
      },
    });
  }

  public initListener() {
    const io = this.io;
    console.log('Init Socket Listeners...');

    io.on('connection', (socket) => {
      console.log('new socket connected', socket.id);

      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log('New message received', message);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
