import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_IMPORTS } from '@import';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [APP_IMPORTS, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
