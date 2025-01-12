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
	changeColor: boolean = false;

	constructor(
		private authService: AuthService,
		private routes: Router,
	) { }

	changeMode()
	{
		this.routes.navigate(['/register']);
	}

	async sendFormValue()
	{
		let checkData = this.authService.checkFormsDataValidation(this.login, this.password)

		this.validData = checkData.valid
		this.message = checkData.message

		let data = {
			login: this.login,
			password: this.password
		}

		if(this.validData){
			this.validData = false;
			this.changeColor = true;

			try {
				this.message = ["Trwa logowanie..."]

				await this.authService.login(data)
				
			} catch (error: any) {
				this.changeColor = false
				this.message = [error.message]
			}
		}
	}
}
