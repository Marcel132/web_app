import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../../modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../../../services/token.service';

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

	email: string = '';
	password: string = '';
	validData?: boolean;
	changeColor: boolean = false;
	message?: string[];

	constructor(
		private authService: AuthService,
		private tokenService: TokenService,
		private routes: Router,
	) { }

	changeMode()
	{
		this.routes.navigate(['home/forms/login']);
	}

	async sendFormValue() {
		let checkData = this.authService.checkFormsDataValidation(this.email, this.password)

		this.validData = checkData.valid;
		this.message = checkData.message;

		let data = {
			email: this.email,
			password: this.password
		}


		if(this.validData) {
			this.validData = false;
			this.changeColor = true;
			this.message = ['Login i hasło poprawne.'];

			try {
				this.message = ['Trwa rejestracja...']

				console.log(this.email)

				await this.authService.register(data)


				this.message = ['Pomyślnie zarejestrowano użytkownika']

				const token = this.tokenService.getTokenStorage("token%auth")

				if(token){
					// this.tokenService.setAccessToken(token)
					setTimeout(() => {
						this.routes.navigate(['/home'])
						window.location.reload()
					}, 2500);
				}
			} catch (error: any){
				this.changeColor = false
				this.message = [error.message]
			}
		}
	}
}
