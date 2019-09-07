import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { Subscription, Observable } from 'rxjs';
import { Document } from 'src/app/models/document';
import { startWith } from 'rxjs/operators';
import { CanvasWhiteboardComponent, CanvasWhiteboardUpdate } from 'ng2-canvas-whiteboard';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  viewProviders: [CanvasWhiteboardComponent],
})
export class DocumentComponent implements OnInit, OnDestroy {
  document: Document;
  private _docSub: Subscription;
  constructor(private documentService: DocumentService, private socket: Socket) { }

  @ViewChild('canvasWhiteboard') canvasWhiteboard: CanvasWhiteboardComponent;
  generatedString: string;
  outputs: string[]
  drawings: Observable<string[]>

  ngOnInit() {
    this._docSub = this.documentService.currentDocument.pipe(
      startWith({ id: '1234', doc: 'Select an existing document or create a new one to get started'})
    ).subscribe(document => this.document = document);
    this.drawings = this.documentService.drawings;
    this.drawings.subscribe(x=>console.log(x))
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  sendBatchUpdates(updates: CanvasWhiteboardUpdate[]) {
    console.log("batch update")
    this.generatedString = this.canvasWhiteboard.generateCanvasDataUrl("image/jpeg", 0.3);
    this.document.doc = this.generatedString
    // this.documentService.sendData(this.generatedString)
    // this.documentService.editDocument(this.document)
  }

  onClear(){
    console.log("clear")
    this.documentService.submitDrawing(this.generatedString)

  }
}

