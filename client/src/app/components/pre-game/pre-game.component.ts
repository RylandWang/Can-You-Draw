import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { Player } from 'src/app/models/player';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {
  player: Player
  players: Observable<Player[]>
  gameStarted: Observable<boolean>;
  playerId: string = ""

  constructor(private readonly socketService: SocketService) { }

  ngOnInit() {
    this.socketService.players.subscribe(x=>console.log(x))
    this.players = this.socketService.players
    this.gameStarted = this.socketService.gameStarted
    this.playerId = this.socketService.generatePlayerId()

    this.player = {
      id: this.playerId,
      name: "default",
      drawing: "",
      score: 0,
      waiting: true
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

}