import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";

@WebSocketGateway(3001)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  private logger = new Logger("AppGateway");

  @SubscribeMessage("message")
  onConnect(@ConnectedSocket() client: Socket, @MessageBody() data: string): string {
    this.logger.log("Message: " + data);
    this.logger.log("Client: " + client.id);
    return client.emit("message", "Ok")
  }

  handleConnection(client) {
    this.logger.log("Client Connected : " + client.id);
    client.emit("connection", "Succesfully Connected");
    client.emit("data", "data");
  }

  handleDisconnect(client: any) {
    this.logger.log("Client Disconnected");
  }
}

