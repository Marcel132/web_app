import { Component } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthModule } from './auth.module';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
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

}
