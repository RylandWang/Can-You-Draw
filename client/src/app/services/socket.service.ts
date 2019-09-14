import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { Document } from '../models/document';
import { Player } from '../models/player';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');
  drawings = this.socket.fromEvent<string[]>("drawings");

  gameStarted = this.socket.fromEvent<boolean>("gameStarted");
  players = this.socket.fromEvent<Player[]>("players")
  playerId = this.socket.fromEvent<number>("playerId")

  id: number = 0

  constructor(private socket: Socket) { }

  convertObservableToBehaviorSubject<T>(observable: Observable<T>, initValue: T): BehaviorSubject<T> {
    const subject = new BehaviorSubject(initValue);

    observable.subscribe(
        (x: T) => {
            subject.next(x);
        },
        (err: any) => {
            subject.error(err);
        },
        () => {
            subject.complete();
        },
    );

    return subject;
}

  ngOnInit(){
    this.playerId.subscribe(x=>this.id=x)
  }

  playerJoin(newPlayer: Player) {
    this.socket.emit("playerJoin", newPlayer)
  }

  playerLeave(player: Player) {
    this.socket.emit("playerLeave", player)
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

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
