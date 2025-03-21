import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product, UserService } from '../../../../../services/user.service';
import { FormsModule } from '@angular/forms';

export interface MealsTable {
	id_prod: number,
	name: string,
	weight: number,
	details: {
		kcal: number,
		proteins: number,
		fats: number,
		carbohydrates: number,
	}
	showDescription?: boolean
	editMode?: boolean
}

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [
		CommonModule,
		FormsModule,
	],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

	products: Product[] = []
	meals: any[] = []
	selectedProductById: number | null = null
	selectedProduct: Product | null = null
	showAddMealCard: boolean = false
	productWeight: number = 0;
	updateProductWeight: number = 0;

	title: string = ''
	description: string = ''

	mealsTable: MealsTable[] = []


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

	onProductChange(){
		this.selectedProduct = this.products.find(prod => prod.id_prod == this.selectedProductById) || null;
	}
	addMealToTable(){
		if(this.selectedProduct == null || this.productWeight == 0){
			return
		}
		this.mealsTable.push({
			id_prod: this.selectedProduct.id_prod,
			name: this.selectedProduct.name,
			weight: this.productWeight,
			details: {
				kcal: this.selectedProduct.details.kcal * this.productWeight / 100,
				proteins: this.selectedProduct.details.proteins * this.productWeight / 100,
				fats: this.selectedProduct.details.fats * this.productWeight / 100,
				carbohydrates: this.selectedProduct.details.carbohydrates * this.productWeight / 100,
			},
			showDescription: false,
			editMode: false
		})
		console.log(this.mealsTable.length)
		console.log(this.mealsTable)
	}

	toggleDescription(index: number): void {
		this.mealsTable[index].showDescription = !this.mealsTable[index].showDescription
	}
	deleteMealFromTable(index: number): void {
		this.mealsTable.splice(index, 1)
	}
	editMealFromTable(index: number): void {
		this.toggleEditMode(index)
		this.mealsTable[index].weight = this.updateProductWeight
		if (this.selectedProduct) {
			this.mealsTable[index].details = {
				kcal: this.selectedProduct.details.kcal * this.updateProductWeight / 100,
				proteins: this.selectedProduct.details.proteins * this.updateProductWeight / 100,
				fats: this.selectedProduct.details.fats * this.updateProductWeight / 100,
				carbohydrates: this.selectedProduct.details.carbohydrates * this.updateProductWeight / 100,
			}
		}
		console.log("Index: " +  JSON.stringify(this.mealsTable[index]))
		console.log("Tablica: " + JSON.stringify(this.mealsTable))
	}

	toggleEditMode(index: number): void {
		this.mealsTable[index].editMode = !this.mealsTable[index].editMode
	}
}
