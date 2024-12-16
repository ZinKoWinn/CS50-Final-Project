import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MeetingNoteArchive } from "@model/meeting-note-archive";
import { BaseFirebaseCrudService } from "@shared/services/firebase-crud.service";

@Injectable({
    providedIn: 'root'
  })
  export class MeetingNoteArchiveService extends BaseFirebaseCrudService<MeetingNoteArchive>{
    constructor(firestore: AngularFirestore) {
      super(firestore, 'meeting-note-archive');
    }
  }
  