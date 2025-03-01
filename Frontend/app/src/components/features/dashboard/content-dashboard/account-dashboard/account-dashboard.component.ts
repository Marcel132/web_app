import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../../../services/token.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../../pipes/translate.pipe';

@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		TranslatePipe,
	],
  templateUrl: './account-dashboard.component.html',
  styleUrl: './account-dashboard.component.scss'
})
export class AccountDashboardComponent {

	constructor(
		private tokenService: TokenService,
	) {	}

	customFontUrl: string =''
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
		this.tokenService.getEmailSubject().subscribe((email) => {
			this.user.email = email
			this.tokenService.getRoleSubject().subscribe((role) => {
				this.user.role = role
			})
		})

		const email = this.tokenService.getEmailSubjectValue()
		if(email != null && email != ''){
			this.isLogged = true
		}

		if(typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
			const customFontUrl = localStorage.getItem('customFontUrl')
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
