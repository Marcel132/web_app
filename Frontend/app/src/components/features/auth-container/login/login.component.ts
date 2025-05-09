import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../../../services/token.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-login',
		standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

	email: string = '';
	password: string = '';
	validData?: boolean;
	message?: string[];
	changeColor: boolean = false;

	constructor(
		private authService: AuthService,
		private tokenService: TokenService,
		private routes: Router,
	) { }

	changeMode()
	{
		this.routes.navigate(['/home/account/forms/register']);
	}

	async sendFormValue()
	{
		let checkData = this.authService.checkFormsDataValidation(this.email, this.password)

		this.validData = checkData.valid
		this.message = checkData.message

		let data = {
			email: this.email,
			password: this.password
		}

		if(this.validData){
			this.validData = false;
			this.changeColor = true;

			try {
				this.message = ["Trwa logowanie..."]

				await this.authService.login(data)

				this.message = ["Zalogowano"]

				const token = this.tokenService.getToken("token%auth")

				if(token){
					// this.tokenService.setAccessToken(token)
					setTimeout(() => {
						this.routes.navigate(['/home'])
						// window.location.reload()
					}, 1500);
				}

			} catch (error: any) {
				this.changeColor = false
				this.message = [error.message]
			}
		}
	}
}
