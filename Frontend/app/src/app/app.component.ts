import { Component } from '@angular/core';
import { AppModule } from '../modules/app.module';
import { AuthContainerComponent } from '../components/features/auth-container/auth-container.component';
import { AuthService } from '../services/auth.service';
import { DashboardComponent } from "../components/features/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppModule,
    AuthContainerComponent,
    DashboardComponent
],
	providers: [
		AuthService
	],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';
}
