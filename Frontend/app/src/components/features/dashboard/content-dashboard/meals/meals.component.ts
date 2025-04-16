import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MealsTable } from '../../../../../interfaces/meals-table';
import { StateService } from '../../../../../services/state.service';
import { Product } from '../../../../../interfaces/product';
import { Meals } from '../../../../../interfaces/meals';
import { LoadingCircleComponent } from "../../../../shared/loading-circle/loading-circle.component";

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingCircleComponent
],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

	products: Product[] = [] // Product that user can select
	selectedProductById: number | null = null // Selected product sorting by ID
	selectedProduct: Product | null = null // Selected product details
	showAddMealCard: boolean = false // Card is visible for user when click a button
	visibleIndex!: number | null
	showDetails!: boolean[]
	weight: number = 0; // Select weight
	editWeight: number = 0; // Edit weight

	title: string = '' // Title of meal
	description: string = '' // Description of meal

	mealsTable: MealsTable[] = [] // Array with all user products

	handler = {
		state: false,
		message: ""
	} // Handler for server response

	userMeals: Meals | null = null // User data with all meals

	constructor(
		private userService: UserService,
		private stateService: StateService,
	){}

	ngOnInit(): void {
		this.stateService.products$.subscribe(products => {
			if(products == null){
				this.userService.fetchProductsData()
			} else {
				this.products = products
			}
		})
		this.stateService.userMealsSubject$.subscribe(meals => {
			if(meals == null){
				this.userService.fetchUserMealsData()
			} else {
				this.userMeals = meals;
			}
		})
	}

	onProductChange(){
		this.selectedProduct = this.products.find(prod => prod.id_prod == this.selectedProductById) || null;
	}

	addMealToTable(){
		if(this.selectedProduct == null || this.weight == 0){
			return
		}
		this.mealsTable.push({
			id_prod: this.selectedProduct.id_prod,
			name: this.selectedProduct.name,
			weight: this.weight,
			productDetails: {
				kcal: this.selectedProduct.productDetails.kcal * this.weight / 100,
				proteins: this.selectedProduct.productDetails.proteins * this.weight / 100,
				fats: this.selectedProduct.productDetails.fats * this.weight / 100,
				carbohydrates: this.selectedProduct.productDetails.carbohydrates * this.weight / 100,
			},
			showDescription: false,
			editMode: false
		})
	}


	deleteMealFromTable(index: number): void {
		this.mealsTable.splice(index, 1)
	}
	editMealFromTable(index: number): void {
		this.toggleList('edit-mode', index)
		this.mealsTable[index].weight = this.editWeight
		if (this.selectedProduct) {
			this.mealsTable[index].productDetails = {
				kcal: this.selectedProduct.productDetails.kcal * this.editWeight / 100,
				proteins: this.selectedProduct.productDetails.proteins * this.editWeight / 100,
				fats: this.selectedProduct.productDetails.fats * this.editWeight / 100,
				carbohydrates: this.selectedProduct.productDetails.carbohydrates * this.editWeight / 100,
			}
		}
	}


	saveMeal(){
		if(this.title.length > 80 || this.title.length == 0){
			this.handler.state = true;
			this.handler.message = "Twój tytuł nie spełnia wymagań"
		}
		else if( this.description.length > 250 || this.description.length == 0){
			this.handler.state = true;
			this.handler.message = "Twój opis nie spełnia wymagań"
		}
		else {
			if(this.mealsTable.length > 0 && this.weight > 0){
				this.userService.saveUserMeal(this.title, this.description, this.mealsTable)
				.then(response => {
					if(response) {
						this.handler.state = response.state
						this.handler.message = response.message
					}
				})
			} else {
				this.handler.state = true
				this.handler.message = "Aby dodać posiłek podaj produkt i jego wagę"
			}
		}
	}

	toggleList(select: string, index: number){
		switch(select)
		{
			case 'description':
			this.mealsTable[index].showDescription = !this.mealsTable[index].showDescription
			break;

			case 'details':
			this.visibleIndex = this.visibleIndex === index ? null : index
			break;

			case 'edit-mode':
			this.mealsTable[index].editMode = !this.mealsTable[index].editMode
			break;

			case 'add-meal':
			this.showAddMealCard = !this.showAddMealCard
			break;
		}
	}


}
