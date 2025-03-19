import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { UserService } from '../../../services/user.service';
import { UserModule } from './user.module';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
		UserModule,
		RouterModule,
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

	constructor(
		private userService: UserService,
		private tokenService: TokenService,
	){}

	ngOnInit(): void {
		if(typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'){
			const useEma = this.tokenService.setUserEmail()
			const useRole =  this.tokenService.setUserRole()
			const subDet = this.tokenService.setSubscriptionDetails()
		}
	}

}
