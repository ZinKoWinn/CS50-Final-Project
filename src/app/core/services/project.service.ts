import { Injectable } from '@angular/core';
import { BaseFirebaseCrudService } from '../../shared/services/firebase-crud.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Project } from 'src/app/core/models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseFirebaseCrudService<Project>{

  constructor(fireStore: AngularFirestore) {
    super(fireStore, 'projects');
  }
}
