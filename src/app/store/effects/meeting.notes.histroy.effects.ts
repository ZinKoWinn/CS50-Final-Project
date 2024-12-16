import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import * as meetingNotesHistoryActions from '@action/meeting.notes.history.actions';
import { MeetingNotesService } from '@service/meeting.notes.service';

@Injectable()
export class MeetingNotesHistoryEffects {
    constructor(
        private actions$: Actions,
        private meetingNoteService: MeetingNotesService
    ) {
    }

    loadMeetingNotesHistory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(meetingNotesHistoryActions.loadMeetingNotesHistory),
            mergeMap(() =>
                this.meetingNoteService.getAll().pipe(
                    map(meetingNotesHistory => meetingNotesHistoryActions.loadMeetingNotesHistorySuccess({ meetingNotesHistory })),
                    catchError(error => of(meetingNotesHistoryActions.loadMeetingNotesHistoryFailure({ error })))
                )
            )
        )
    );
}
