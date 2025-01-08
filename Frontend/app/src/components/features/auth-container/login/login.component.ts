import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../../modules/shared.module';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
	SharedModule,
	FormsModule,
	ReactiveFormsModule,
	],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

	login: string = '';
	password: string = '';
	validData?: boolean;
	message?: string[];

	constructor(
		private authService: AuthService,
		private routes: Router,
	) { }

	ngOnInit(): void {
		if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined')
		{
			if(this.authService.getToken() != undefined || null)
			{
				this.routes.navigate(['/home'])
			}
		}
		else
		{
			console.warn('localStorage is not available in this environment.');
		}
	}

	changeMode()
	{
		this.routes.navigate(['/register']);
	}

	sendFormValue()
	{
	}
}
