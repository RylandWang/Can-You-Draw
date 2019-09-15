import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription, Observable } from 'rxjs';
import { CanvasWhiteboardComponent, CanvasWhiteboardUpdate, CanvasWhiteboardService } from 'ng2-canvas-whiteboard';
import { Player } from 'src/app/models/player';
import { Time } from '@angular/common';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  viewProviders: [CanvasWhiteboardComponent],
})
export class DocumentComponent implements OnInit {

  @ViewChild('canvasWhiteboard') canvasWhiteboard: CanvasWhiteboardComponent;
  generatedString: string;
  outputs: string[]
  drawings: Observable<string[]>

  @Input() players: Observable<Player[]>
  @Input() player: Player

  timeLeft: number = 120;
  interval;

  drawingComplete: boolean = false;

  constructor(private readonly socketService: SocketService,
    private _canvasWhiteboardService: CanvasWhiteboardService) {
  }

  ngOnInit() {
    this.startTimer()
    // set canvas height to be 0.8*window.height
    document.getElementById("canvas").style.height = (window.innerHeight * 0.8).toString() + "px";
    this.socketService.playerLeave(this.player)
    this.socketService.playerJoin(this.player)

    this.drawings = this.socketService.drawings;


  }

  sendBatchUpdates(updates: CanvasWhiteboardUpdate[]) {
    console.log("batch update")
    this.generatedString = this.canvasWhiteboard.generateCanvasDataUrl("image/jpeg", 0.3);

    // this.documentService.sendData(this.generatedString)
    // this.documentService.editDocument(this.document)
  }

  submitDrawing() {
    this.socketService.submitDrawing(this.generatedString)
    this.drawingComplete = true
  }


  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    }, 1000)
  }
}
