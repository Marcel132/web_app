import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
		private tokenService: TokenService,
		private router: Router,
		private route: ActivatedRoute,
	){}

	toggleMenuVariable: boolean = true;
	roleSubject: string | null = null
	isHomeRoute: boolean = true

	ngOnInit(): void {
		this.tokenService.userRoleSubject$.subscribe((role) => {
			this.roleSubject = role
		})

		this.router.events.subscribe(() => {
			this.isHomeRoute = this.router.url === '/home'
		})

	}

	toggleMenu(){
		this.toggleMenuVariable = !this.toggleMenuVariable
	}

	logout(){
		this.tokenService.logout()
	}
}
