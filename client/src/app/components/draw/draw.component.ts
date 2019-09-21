import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import {Observable } from 'rxjs';
import { CanvasWhiteboardComponent, CanvasWhiteboardUpdate } from 'ng2-canvas-whiteboard';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
  viewProviders: [CanvasWhiteboardComponent],
})
export class DrawComponent implements OnInit {

  @ViewChild('canvasWhiteboard') canvasWhiteboard: CanvasWhiteboardComponent;
  generatedString: string;
  outputs: string[]
  drawings: Observable<string[]>

  @Input() players: Observable<Player[]>
  @Input() player: Player

  timeLeft: number = 120;
  interval;

  drawingComplete: boolean = false;
  numPlayersDrawing: Observable<number>;

  constructor(private readonly socketService: SocketService) {}

  ngOnInit() {    
    this.socketService.updateAllPlayers()
    this.socketService.updateNumPlayersDrawing()
    this.startTimer()
    this.numPlayersDrawing = this.socketService.numPlayersDrawing;
    this.drawings = this.socketService.drawings;
    // set canvas height to be 0.8*window.height
    // document.getElementById("canvas").style.height = (window.innerHeight * 0.8).toString() + "px";
    
  }

  sendBatchUpdates(updates: CanvasWhiteboardUpdate[]) {
    console.log("batch update")
    this.generatedString = this.canvasWhiteboard.generateCanvasDataUrl("image/jpeg", 0.3);
    // this.documentService.sendData(this.generatedString)
    // this.documentService.editDocument(this.document)
  }

  submitDrawing() {
    this.player.waiting = false
    this.socketService.updatePlayer(this.player)
    this.socketService.updateNumPlayersDrawing(-1)

    this.socketService.submitDrawing(this.generatedString)
  }

  private startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } 
    }, 1000)
  }
}