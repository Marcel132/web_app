import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
		
	],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

	constructor(
		private routes: Router,
	) { }

	changeMode()
	{
		this.routes.navigate(['/register']);
	}

}
