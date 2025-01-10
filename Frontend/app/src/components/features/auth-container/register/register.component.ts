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

	async sendFormValue() {
		let checkData = this.authService.checkRegisterData(this.login, this.password)

		this.validData = checkData.valid;
		this.message = checkData.message;

		let data = {
			login: this.login,
			password: this.password
		}


		if(this.validData) {
			this.validData = false;
			this.changeColor = true;
			this.message = ['Login i hasło poprawne.'];

			try {
				this.message = ['Trwa rejestracja...']

				const response = await this.authService.register(data)

				this.message = ['Pomyślnie zarejestrowano użytkownika']

				if(this.authService.getToken() != null){
					setTimeout(() => {
						this.routes.navigate(['/home'])
					}, 2500);
				}
			} catch (error: any){
				this.changeColor = false
				this.message = [error.message]
			}
		}
	}
}
