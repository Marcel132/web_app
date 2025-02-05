import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { NoLoggedUsersComponent } from "./no-logged-users/no-logged-users.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    NoLoggedUsersComponent,
    FooterComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

	constructor(
		private userService: UserService
	){}
}
