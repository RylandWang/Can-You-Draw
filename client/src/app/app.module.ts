import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DrawComponent } from './components/draw/draw.component';
import {CanvasWhiteboardModule} from 'ng2-canvas-whiteboard';
import { PreGameComponent } from './components/pre-game/pre-game.component';
import { GuessComponent } from './components/guess/guess.component'


const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    DrawComponent,
    PreGameComponent,
    GuessComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    CanvasWhiteboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
