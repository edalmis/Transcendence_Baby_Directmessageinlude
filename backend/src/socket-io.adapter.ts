import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

// export class SocketIoAdapter extends IoAdapter {
//   createIOServer(port: number, options?: ServerOptions): any {
//     const server = super.createIOServer(port, options);
//     // Any additional configuration or event handling you'd like
//     return server;
//   }
// }
//--------------------------
export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    options = {
      ...options,
      cors: {
        origin: "*", // Modify this accordingly, wildcards are not recommended for production.
        methods: ["GET", "POST"],
        // ... add any other CORS configurations you want
      },
    };
    const server = super.createIOServer(port, options);
    return server;
  }
}
