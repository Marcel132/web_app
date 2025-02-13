import { Component } from '@angular/core';
import { AppModule } from '../modules/app.module';
import { AuthContainerComponent } from '../components/features/auth-container/auth-container.component';
import { AuthService } from '../services/auth.service';
import { DashboardComponent } from "../components/features/dashboard/dashboard.component";
import { UserService } from '../services/user.service';
import { RouterModule } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppModule,
		RouterModule
],
	providers: [
		AuthService,
		UserService
	],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';

	constructor(
		private tokenService: TokenService,
	) {}

	ngOnInit(): void {
		if(typeof window !== 'undefined'){
			if(!this.tokenService.getTokenSubjectValue()){
				console.log("Refresh Token Checking... ")
				this.tokenService.refreshToken()
			}
		}
	}
}
