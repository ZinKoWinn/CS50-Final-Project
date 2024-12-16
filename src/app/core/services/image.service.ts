import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";

@Injectable({
    providedIn: 'root'
})
export class ImagesService {
    private images: { [name: string]: string } = {};

    constructor(private storage: AngularFireStorage,) {
    }

    retrieveProfileImages(): void {
        this.storage.ref('/profiles').listAll().forEach(data => {
            data.items.forEach(item => {
                item.getDownloadURL().then(url => {
                    this.images[item.name] = url;
                });
            });
        })
    }

    getProfileImage(name: string, extension: string = '.jpg'): string {
        const fileName = `${name?.replaceAll(' ', '-')}${extension}`;
        let fullPath = `assets/images/profiles/default.jpg`;
        return this.images[fileName] || `${fullPath.replace(/\\/g, "/")}`
    }
}
