import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-content-dashboard',
  standalone: true,
  imports: [
		RouterModule,
		CommonModule
	],
  templateUrl: './content-dashboard.component.html',
  styleUrl: './content-dashboard.component.scss'
})
export class ContentDashboardComponent {


	constructor(
		private tokenService: TokenService
	){}

	toggleMenuVariable: boolean = true;
	roleSubject: string | null = null

	ngOnInit(): void {
		this.tokenService.getRoleSubject().subscribe((role) => {
			this.roleSubject = role
		})
	}

	toggleMenu(){
		this.toggleMenuVariable = !this.toggleMenuVariable
	}
}
