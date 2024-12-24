import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SharedModule } from '../../../modules/shared.module';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.scss'
})
export class AuthContainerComponent {

}
