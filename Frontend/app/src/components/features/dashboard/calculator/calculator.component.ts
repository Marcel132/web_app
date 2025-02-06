import { Component } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../modules/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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

	constructor(
		private userService: UserService,
		private fb: FormBuilder
	){
		this.formProductCalculator = this.fb.group({
			selectedProduct: [null, Validators.required],
			weight: ["", [Validators.required, Validators.min(1)]]
		})
	}

	ngOnInit(): void {
		this.userService.getProductsData().subscribe((data) => {
			this.products = data
		}, (error) => {
			console.error(error)
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

		console.log("Dane: " + JSON.stringify(this.data))
	}

	sum() {
		let proteins = 0, fats = 0, carbohydrates = 0, kcal = 0, weight;

		for (let i = 0; i < this.data.length; i++) {
			let product = this.data[i].name;
			let weight = this.data[i].weight;
			let details = product.details;

			if(details){
				kcal += details.kcal * weight / 100;
				proteins += details.proteins * weight / 100;
				fats += details.fats * weight / 100;
				carbohydrates += details.carbohydrates * weight / 100;
			}
		}

		console.group('Total');
		console.info("Kcal: " + kcal.toFixed(2));
		console.info("Proteins: " + proteins.toFixed(2));
		console.info("Fats: " + fats.toFixed(2));
		console.info("Carbohydrates: " + carbohydrates.toFixed(2));
		console.groupEnd();
	}
}
