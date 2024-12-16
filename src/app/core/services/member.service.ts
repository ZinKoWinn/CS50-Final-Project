import { Injectable } from '@angular/core';
import { BaseFirebaseCrudService } from '../../shared/services/firebase-crud.service';
import { Member } from 'src/app/core/models/member';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends BaseFirebaseCrudService<Member>{
  constructor(firestore: AngularFirestore) {
    super(firestore, 'members');
  }
}
