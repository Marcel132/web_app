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

	isLogged!: boolean

	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		this.isLogged = this.tokenService.getTokenSubjectValue() != null
	}

}
