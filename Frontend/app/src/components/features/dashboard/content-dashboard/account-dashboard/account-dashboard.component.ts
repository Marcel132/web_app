import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../../../services/token.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../../pipes/translate.pipe';
import { BooleanHandlerPipe } from '../../../../../pipes/boolean-handler.pipe';
import { SubscriptionInterface } from '../../../../../interfaces/subscription.details';

@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		TranslatePipe,
		BooleanHandlerPipe
	],
  templateUrl: './account-dashboard.component.html',
  styleUrl: './account-dashboard.component.scss'
})
export class AccountDashboardComponent {

	constructor(
		private tokenService: TokenService,
		private route: Router,
	) {	}

	customFontUrl: string =''
	isLogged: boolean = false
	user = {
		email: '',
		role: '',
	}
	package!: SubscriptionInterface | null

	validationInfo = {
		fontValid: true,
		fontError: ''
	}

	ngOnInit(): void {
		this.tokenService.userEmailSubject$.subscribe((email) => {
			this.user.email = email
		})
		this.package = this.tokenService.getSubscriptionDetails()

		this.tokenService.userRoleSubject$.subscribe((role) => {
			this.user.role = role
		})

		console.log(this.package)
		const email = this.tokenService.getUserEmail()
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

	buyPremium(){
		this.route.navigate(['/buy-premium'])
	}

}
