import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MealsTableInterface } from '../../../../../interfaces/meals-table';
import { StateService } from '../../../../../services/state.service';
import { ProductInterface } from '../../../../../interfaces/product';
import { MealsInterface } from '../../../../../interfaces/meals';
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
export class MealsComponent implements OnInit{

	products: ProductInterface[] | null = null;
	selectedProduct: number | null = null;
	selectedProductDetails: ProductInterface | null = null;
	toggleAddMealCard: boolean = false;
	detailsIndex: number | null = null
	toggleDetails: boolean = false;
	productWeight: {weight: number | null, newWeight: number | null} = {
		weight: null,
		newWeight: null,
	}
	productData: {title: string | null, description: string | null} = {
		title: null,
		description: null,
	}

	meals: MealsInterface | null = null;
	mealDetails: MealsTableInterface[] | null = null;

	handler: {state: boolean, message: string, errorColor: boolean} = {
		state: false,
		message: '',
		errorColor: false,
	}

	constructor(
		private userService: UserService,
		private stateService: StateService,
	) {}


	ngOnInit(): void {
			this.stateService.products$.subscribe(
				products => {
					if(products) {
						this.products = products;
					}
					else {
						this.userService.fetchProductsData();
					}
				}
			)

			this.stateService.userMealsSubject$.subscribe(
				meals => {
					if(meals){
						this.meals = meals
					}
					else {
						this.userService.fetchUserMealsData()
					}
				}
			)
	}

	onProductChange(){
		if(this.products){
			this.selectedProductDetails = this.products.find(product => product.id_prod == this.selectedProduct) || null
		}
	}

	addProductToTable()
	{
		if(!this.selectedProduct || !this.productWeight.weight){
			this.handler = {state: true, message: "Należy wybrać produkt oraz wagę", errorColor: true}
			return;
		}
		if(!this.mealDetails){
			this.mealDetails = []
		}
		if(this.mealDetails && this.selectedProductDetails) {
			const weight = this.productWeight.weight;
			this.mealDetails.push({
				id_prod: this.selectedProductDetails.id_prod,
				name: this.selectedProductDetails.name,
				weight: this.productWeight.weight,
				productDetails: {
					kcal: this.selectedProductDetails.productDetails.kcal * weight / 100,
					proteins: this.selectedProductDetails.productDetails.proteins * weight / 100,
					fats: this.selectedProductDetails.productDetails.fats * weight / 100,
					carbohydrates: this.selectedProductDetails.productDetails.carbohydrates * weight / 100
				},
				showDescription: false,
				editMode: false,
			})
		}
	}

	deleteMealsProduct(index: number): void {
		if(this.mealDetails != null){
			this.mealDetails.splice(index, 1)
		}
	}

	editMealFromTable(index: number): void {
		this.toggleList('edit-mode', index)
		if(this.mealDetails != null){
			const weight = this.productWeight.newWeight
			if(weight && weight > 0){
				this.mealDetails[index].weight = weight;
				if (this.selectedProductDetails) {
					this.mealDetails[index].productDetails = {
						kcal: this.selectedProductDetails?.productDetails.kcal * weight / 100,
						proteins: this.selectedProductDetails.productDetails.proteins * weight / 100,
						fats: this.selectedProductDetails.productDetails.fats * weight / 100,
						carbohydrates: this.selectedProductDetails.productDetails.carbohydrates * weight / 100,
					}
				}
			}
		}
	}

	saveMeal(){
		const title = this.productData.title;
		const description = this.productData.description;

		if(title && (title.length > 80 || title.length <= 0)){
			this.handler = {state: true, message: "Twój tytuł nie spełnia wymagań", errorColor: true}
			return;
		}
		if(description && (description.length > 250 || description.length == 0)){
			this.handler = {state: true, message: "Twój opis nie spełnia wymagań", errorColor: true}
			return;
		}
		try {
			this.handler = {state: false, message: "", errorColor: false};
			if(!title){
				this.handler = {state: true, message: "Musisz mieć tytuł", errorColor: true};
				return;
			}
			if(!description){
				this.handler = {state: true, message: "Musisz mieć opis", errorColor: true};
				return
			}
			if(this.mealDetails && this.mealDetails.length > 0 && this.productWeight.weight && this.productWeight.weight > 0){
				this.userService.saveUserMeal(title, description, this.mealDetails)
				.then( response => {
					this.handler = {state: true, message: response.message, errorColor: false};
				})
			} else {
				this.handler = {state: true, message: "Należy wybrać produkt i jego wagę", errorColor: true}
			}
		} catch (error) {
			this.handler = {state: true, message: "Błąd serwera", errorColor: true}
			console.group("Add a meal")
			console.error(error)
		}

	}

	toggleList(select: string, index: number){
		if(select == "add-meal") {
			this.toggleAddMealCard = !this.toggleAddMealCard
			return;
		}
		if(select == "details") {
			this.detailsIndex = this.detailsIndex === index ? null : index;
			return;
		}

 		if(!this.mealDetails) {
			return;
		}
		switch(select)
		{
			case 'description':
			this.mealDetails[index].showDescription = !this.mealDetails[index].showDescription
			break;

			case 'edit-mode':
			this.mealDetails[index].editMode = !this.mealDetails[index].editMode
			break;
		}
	}
}
