import { Component } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../modules/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { tokenConfig } from '../../../../services/token.config';

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
	proteins = 0
	fats = 0
	carbohydrates = 0
	kcal = 0;

	constructor(
		private userService: UserService,
		private fb: FormBuilder
	){
		this.formProductCalculator = this.fb.group({
			selectedProduct: [null, Validators.required],
			weight: ["", [Validators.required, Validators.min(1)]]
		})
	}

	async ngOnInit() {
	  this.userService.getProductsData().subscribe((data) => {
			this.products = data
		}, (error) => {
			console.error(error)
		})

		console.log(tokenConfig().getTokenValue())
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

		console.log("Dane: " + JSON.stringify(this.data))
	}

	sum() {

		for (let i = 0; i < this.data.length; i++) {
			let product = this.data[i].name;
			let weight = this.data[i].weight;
			let details = product.details;

			if(details){
				this.kcal += details.kcal * weight / 100;
				this.proteins += details.proteins * weight / 100;
				this.fats += details.fats * weight / 100;
				this.carbohydrates += details.carbohydrates * weight / 100;
			}
		}

		console.group('Total');
		console.info("Kcal: " + this.kcal.toFixed(2));
		console.info("Proteins: " + this.proteins.toFixed(2));
		console.info("Fats: " + this.fats.toFixed(2));
		console.info("Carbohydrates: " + this.carbohydrates.toFixed(2));
		console.groupEnd();

		return
	}

	deleteItem(number: number){
		if(number >= 0 && number < this.data.length){
			this.data.splice(number, 1)
		}
	}

	reset(){
		this.data = []
	}
}
