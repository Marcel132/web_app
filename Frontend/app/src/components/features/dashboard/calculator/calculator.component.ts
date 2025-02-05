import { Component } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
		CommonModule
	],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {

	constructor(
		private userService: UserService
	){}
	products:any = []

 ngOnInit(): void {
	this.userService.getProductsData().subscribe((data) => {
		this.products = data
	}, (error) => {
		console.error(error)
	})
 }

}
