import { Injectable } from "@angular/core";
import { BaseFirebaseCrudService } from "../../shared/services/firebase-crud.service";
import { User } from "src/app/core/models/user";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseFirebaseCrudService<User>{
    constructor(firestore: AngularFirestore) {
        super(firestore, 'users');
    }
}