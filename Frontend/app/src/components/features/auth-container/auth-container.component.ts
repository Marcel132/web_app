import { Component } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { AuthModule } from './auth.module';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [
    AuthModule,
    SharedModule,
    RouterModule,
],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.scss'
})
export class AuthContainerComponent {

	constructor(
		private tokenService: TokenService,
		private routes: Router
	){}

	async ngOnInit() {
		if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
			try {
				const token = this.tokenService.getTokenSubjectValue()
				if(token != null){
					this.routes.navigate(['/home'])
				}
			}
			catch(error){
				console.warn("Error while getting a token" + error)
			}
		}
		else {
			console.warn('Session storage is not available in this environment.');
		}
	}

}
