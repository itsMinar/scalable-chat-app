import Redis from 'ioredis';
import { Server } from 'socket.io';

const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});
const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

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

    sub.subscribe('MESSAGES');
  }

  public initListener() {
    const io = this.io;
    console.log('Init Socket Listeners...');

    io.on('connection', (socket) => {
      console.log('new socket connected', socket.id);

      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log('New message received -', message);
        // publish this message to redis
        await pub.publish('MESSAGES', JSON.stringify({ message }));
      });
    });

    sub.on('message', (channel, message) => {
      if (channel === 'MESSAGES') {
        io.emit('message', message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
