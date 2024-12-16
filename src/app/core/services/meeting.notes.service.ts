import { Injectable } from '@angular/core';
import { BaseFirebaseCrudService } from '../../shared/services/firebase-crud.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MeetingNotes } from '@model/meeting-note';

@Injectable({
    providedIn: 'root'
})
export class MeetingNotesService extends BaseFirebaseCrudService<MeetingNotes> {

    constructor(firestore: AngularFirestore) {
        super(firestore, 'meetingNotes');
    }
}
