import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_IMPORTS } from 'src/app/app.import';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [APP_IMPORTS, RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent  {

}
