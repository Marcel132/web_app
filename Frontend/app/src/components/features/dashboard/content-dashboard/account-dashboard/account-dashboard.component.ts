import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../../../services/token.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [
		CommonModule,
		RouterModule,
		FormsModule
	],
  templateUrl: './account-dashboard.component.html',
  styleUrl: './account-dashboard.component.scss'
})
export class AccountDashboardComponent {

	constructor(
		private tokenService: TokenService,
	) {	}

	customFontUrl: string = localStorage.getItem('customFontUrl') || ''
	isLogged: boolean = false
	user = {
		email: '',
		role: ''
	}

	validationInfo = {
		fontValid: true,
		fontError: ''
	}

	ngOnInit(): void {
		const email = this.tokenService.getEmailValue()
		if(email != null && email != ''){
			this.isLogged = true
			this.user.email = email
			this.user.role = this.tokenService.getRoleValue()
		}
	}

	saveFont() {
    if (this.validFontUrl(this.customFontUrl.trim())) {
      localStorage.setItem('customFontUrl', this.customFontUrl);
      alert('Font zapisany! Odśwież stronę, aby zobaczyć efekt.');
    }
  }

	validFontUrl(url: string) : boolean{
		if(url == ''){
			this.validationInfo.fontError = 'URL nie może być pusty'
			this.validationInfo.fontValid = false
			return false
		}
		else if(!url.includes("https://fonts.googleapis.com/")){
			this.validationInfo.fontError = 'Czcionka nie pochodzi z Google Fonts'
			this.validationInfo.fontValid = false
			return false
		}
		else if(url.includes("https://fonts.googleapis.com/")){
			this.validationInfo.fontError = ''
			this.validationInfo.fontValid = true
			return true
		}
		else {
			this.validationInfo.fontError = 'Nieprawidłowy URL czcionki'
			this.validationInfo.fontValid = false
			return false
		}

	}

}
