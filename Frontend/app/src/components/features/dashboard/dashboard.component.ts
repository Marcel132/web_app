import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StateService } from '../../../services/state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
		RouterModule,
		CommonModule,
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


	constructor(
		private stateService: StateService,
		private router: Router,
		private route: ActivatedRoute,
	){}

	toggleMenuVariable: boolean = true;
	roleSubject: string | null = null
	isHomeRoute: boolean = true

	ngOnInit(): void {

		this.stateService.userRoleSubject$.subscribe(response => {
			this.roleSubject = response
		})

		this.router.events.subscribe(() => {
			this.isHomeRoute = this.router.url === '/home'
		})

	}

	toggleMenu(){
		this.toggleMenuVariable = !this.toggleMenuVariable
	}

	logout(){
		this.stateService.logout()
		this.router.navigate(["/home"])
		window.location.reload()
	}

}
