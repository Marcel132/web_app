import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { tokenConfig } from '../../../../services/token.config';

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


	isLogged = tokenConfig().getTokenValue()

}
