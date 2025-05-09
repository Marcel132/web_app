import { Component } from '@angular/core';
import { StateService } from '../../../services/state.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-admin',
		standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent {

	// This component is used to manage the admin panel of the application.
	userRole: string | null = null;
	constructor(
		private stateService: StateService
	) { }

	ngOnInit(): void {
		this.stateService.userRoleSubject$.subscribe((role) => {
			this.userRole = role;
		})
	}
}
