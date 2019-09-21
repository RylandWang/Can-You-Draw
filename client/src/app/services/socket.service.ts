import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { Document } from '../models/document';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');
  drawings = this.socket.fromEvent<string[]>("drawings");

  gameStarted = this.socket.fromEvent<boolean>("gameStarted");
  drawComplete = this.socket.fromEvent<boolean>("gamestar")

  player = this.socket.fromEvent<Player>("player")
  players = this.socket.fromEvent<Player[]>("players")
  playerId = this.socket.fromEvent<number>("playerId")
  numPlayersDrawing = this.socket.fromEvent<number>("numPlayersDrawing")

  constructor(private socket: Socket) { }

  updatePlayer(player: Player){
    this.socket.emit("updatePlayer", player)
  }

  updateAllPlayers(){
    this.socket.emit("updateAllPlayers")
  }

  playerJoin(newPlayer: Player){
    this.socket.emit("playerJoin", newPlayer)
  }

  playerLeave(player: Player){
    this.socket.emit("playerLeave", player)
  }

  updateNumPlayersDrawing(increment: number = 0){
    this.socket.emit("updateNumPlayersDrawing", increment)
  }

  startGame(){
    this.socket.emit("startGame")
  }

  submitDrawing(generatedString: string){
    this.socket.emit('submitDrawing', generatedString)
  }

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  // newDocument() {
  //   this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  // }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }

  sendData(text: string) {
    var data = { msg:  text }
    this.socket.emit('data', data)
}

  generatePlayerId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
