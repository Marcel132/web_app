import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content-dashboard',
  standalone: true,
  imports: [
		RouterModule,
	],
  templateUrl: './content-dashboard.component.html',
  styleUrl: './content-dashboard.component.scss'
})
export class ContentDashboardComponent {

}
