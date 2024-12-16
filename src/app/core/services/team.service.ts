import { Injectable } from '@angular/core';
import { BaseFirebaseCrudService } from '../../shared/services/firebase-crud.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Team } from 'src/app/core/models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseFirebaseCrudService<Team> {

  constructor(firestore: AngularFirestore) {
    super(firestore, 'teams');
  }
}
