import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StateService } from '../../../../../services/state.service';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
	],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {

	formProductCalculator: FormGroup<any>;

	products:any = [];
	data:any = [];

	proteins: number = 0
	fats: number = 0
	carbohydrates: number = 0
	kcal: number = 0;

	constructor(
		private userService: UserService,
		private stateService: StateService,
		private fb: FormBuilder
	){
		this.formProductCalculator = this.fb.group({
			selectedProduct: [null, Validators.required],
			weight: ["", [Validators.required, Validators.min(1)]]
		})
	}

	async ngOnInit() {
		this.stateService.products$.subscribe(products => {
			if(products == null){
				this.userService.fetchProductsData();
			} else {
				this.products = products
			}
		})
	}


	addValue() {

		let optionProduct = this.formProductCalculator.value.selectedProduct
		let weight = this.formProductCalculator.value.weight

		const product = this.products.find((p: any) => p.name === optionProduct)
		const existingProduct = this.data.find((p: any) => p.name === optionProduct)

		if(!existingProduct){
			this.data.push({ name: product, weight: weight})
		} else {
			existingProduct.weight = weight
		}
	}

	sum() {

		// Reset calories to not double the result
		this.kcal = 0;
		this.proteins = 0;
		this.fats = 0;
		this.carbohydrates = 0;

		for (let i = 0; i < this.data.length; i++) {
			let product = this.data[i].name.name;
			let weight = this.data[i].weight;
			let details = this.data[i].name.productDetails;

			console.group("Dodane produkty")
			console.log("Dane: " + this.data[i])
			console.log("Nazwa: " + JSON.stringify(product) )
			console.log("Waga: " + JSON.stringify(weight) )
			console.log("Szczegóły:  " + JSON.stringify(details) )

			if(details){
				this.kcal += details.kcal * weight / 100;
				this.proteins += details.proteins * weight / 100;
				this.fats += details.fats * weight / 100;
				this.carbohydrates += details.carbohydrates * weight / 100;
			}
		}

		// console.group('W sumie');
		// console.info("Kcal: " + this.kcal.toFixed(2));
		// console.info("Proteiny: " + this.proteins.toFixed(2));
		// console.info("Tłuszcze: " + this.fats.toFixed(2));
		// console.info("Węgle: " + this.carbohydrates.toFixed(2));
		// console.groupEnd();

	}

	deleteItem(number: number){
		if(number >= 0 && number < this.data.length){
			this.data.splice(number, 1)
		}
	}

	reset(){
		this.data = [];
		this.kcal = 0;
		this.proteins = 0;
		this.fats = 0;
		this.carbohydrates = 0;
		this.formProductCalculator.reset()
	}
}
