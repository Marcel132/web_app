import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product, UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [
		CommonModule
	],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

	products: Product[] = []
	meals: any[] = []

	showAddMealCard: boolean = false

	constructor(
		private userService: UserService,
	){}

	ngOnInit(): void {
		this.userService.products$.subscribe(products => {
			if(products == null){
				this.userService.fetchProductsData()
			} else {
				this.products = products
			}
		})
	}

	openAddMeal(): void {
		this.showAddMealCard = !this.showAddMealCard
		this.showAddMealCard == true ? document.body.classList.add("no-scroll") : document.body.classList.remove("no-scroll")
	}

	openEditMeal(meal: any): void {
		console.log("openEditMeal")
	}

	openDeleteMeal(meal: any): void {
		console.log("openDeleteMeal")
	}
}
