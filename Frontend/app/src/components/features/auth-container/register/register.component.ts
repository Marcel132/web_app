import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../../modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
			SharedModule,
			FormsModule,
			ReactiveFormsModule,
			HttpClientModule
	],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

	login: string = '';
	password: string = '';
	validData?: boolean;
	changeColor: boolean = false;
	message?: string[];

	constructor(
		private authService: AuthService,
		private routes: Router,
	) { }
	

	changeMode()
	{
		this.routes.navigate(['/login']);
	}

	sendFormValue() {
		let checkData = this.authService.checkRegisterData(this.login, this.password)

		this.validData = checkData.valid;
		this.message = checkData.message;

		let data = {
			login: this.login,
			password: this.password
		}


		if(this.validData) {
			this.validData = !this.validData;
			this.changeColor = true;
			this.message = ['Login i hasło poprawne.'];
			setTimeout(() => {
				this.message = ['Trwa rejestracja...'];
				this.authService.register(data)
				if(this.authService.getToken() != undefined || null)
				{
					setTimeout(() => { this.routes.navigate(['/home']) }, 2500)
				}
				else {
					this.changeColor = false;
					this.message = ['Rejestracja nie powiodła się. Spróbuj ponownie później lub skontaktuj się z administratorem.'];
				}
			}, 2000)
		}

	}
}
