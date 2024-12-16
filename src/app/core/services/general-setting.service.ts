import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { GeneralSetting } from "@model/general-setting";
import { BaseFirebaseCrudService } from "@shared/services/firebase-crud.service";

@Injectable({
    providedIn: 'root'
  })
  export class GeneralSettingService extends BaseFirebaseCrudService<GeneralSetting>{
    constructor(firestore: AngularFirestore) {
      super(firestore, 'generalSetting');
    }
  }
  