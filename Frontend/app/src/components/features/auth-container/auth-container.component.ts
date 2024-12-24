import { Component } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthModule } from './auth.module';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [
		AuthModule,
    SharedModule,
		DashboardComponent,
		LoginComponent,
		RegisterComponent,
],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.scss'
})
export class AuthContainerComponent {
	isLogged?: boolean;
	isLoginMode: boolean = false;

	constructor(
		private AuthService: AuthService,
	){}

	ngOnInit(): void
	{
		this.isLogged = this.AuthService.isUserLogged();
		console.log(this.isLogged);
	}

}
