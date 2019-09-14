import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { Player } from 'src/app/models/player';
import { Observable } from 'rxjs';
import { async } from 'q';

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {
  player: Player
  players: Player[]
  gameStarted: Observable<boolean>;
  playerId: string = ""

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.setUp()

  }

  async setUp() {
    this.playerId = this.socketService.generatePlayerId()

      this.player = {
        id: this.playerId,
        name: "default",
        drawing: "",
        score: 0,
      }

    this.gameStarted = this.socketService.gameStarted;
    this.socketService.playerJoin(this.player)
  }

  startGame() {
    this.socketService.startGame()
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.socketService.playerLeave(this.player)
  }

  getKeys(map) {
    return Array.from(map.keys());
  }

}
