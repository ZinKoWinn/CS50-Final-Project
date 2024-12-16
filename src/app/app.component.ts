import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataInitializationService } from '@service/data-initialization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {

  constructor(
    private initailizeService: DataInitializationService
  ) {
    this.initailizeService.initializeData();
  }
}
