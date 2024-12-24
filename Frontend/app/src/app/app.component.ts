import { Component } from '@angular/core';
import { AppModule } from '../modules/app.module';
import { AuthContainerComponent } from '../components/features/auth-container/auth-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppModule,
		AuthContainerComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';
	isLogged: boolean = false;
}
