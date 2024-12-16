import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
    providedIn: 'root',
})
export class ToastMessageService {
    constructor(private toast: HotToastService) { }

    success(message: string): void {
        this.toast.success(message, {
            duration: 3000
        });
    }

    error(message: string): void {
        this.toast.error(message, {
            duration: 3000
        });
    }

    info(message: string): void {
        this.toast.info(message, {
            duration: 3000
        });
    }

    warning(message: string): void {
        this.toast.warning(message, {
            duration: 3000
        });
    }
}

