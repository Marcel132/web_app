import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../../../services/token.service';

@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [
		CommonModule,
		RouterModule
	],
  templateUrl: './account-dashboard.component.html',
  styleUrl: './account-dashboard.component.scss'
})
export class AccountDashboardComponent {

	constructor(
		private tokenService: TokenService,
	) {}

	isLogged: boolean = false
	user = {
		email: '',
		role: ''
	}

	ngOnInit(): void {
		const email = this.tokenService.getEmailValue()
		if(email != null && email != ''){
			this.isLogged = true
			this.user.email = email
			this.user.role = this.tokenService.getRoleValue()
		}
	}

}
