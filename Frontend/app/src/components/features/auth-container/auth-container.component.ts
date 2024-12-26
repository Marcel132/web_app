import { Component } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { AuthModule } from './auth.module';
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
