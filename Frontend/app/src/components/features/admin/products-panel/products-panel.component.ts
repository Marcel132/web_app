import { Component } from '@angular/core';
import { StateService } from '../../../../services/state.service';
import { ProductInterface } from '../../../../interfaces/product';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { LoadingCircleComponent } from "../../../shared/loading-circle/loading-circle.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { SaveProductInterface } from '../../../../interfaces/save-product';

@Component({
  selector: 'app-products-panel',
  standalone: true,
  imports: [
    CommonModule,
    LoadingCircleComponent,
		ReactiveFormsModule
],
  templateUrl: './products-panel.component.html',
  styleUrl: './products-panel.component.scss'
})
export class ProductsPanelComponent {

	constructor(
		private stateService: StateService,
		private userService: UserService,
		private adminService: AdminService,
		private fb: FormBuilder
	) {
		this.addProductGroup = this.fb.group({
			idProd: [null, [Validators.required, Validators.min(1)]],
			nameProd: [null, [Validators.required, Validators.min(1)]],
			kcal: [null, [Validators.required, Validators.min(1)]],
			proteins: [null, [Validators.required, Validators.min(1)]],
			fats: [null, [Validators.required, Validators.min(1)]],
			carbohydrates: [null, [Validators.required, Validators.min(1)]],
		})
	}

	products: ProductInterface[] | null = null;
	addProductGroup: FormGroup<any>
	errorHandler: {state: boolean, message: string} = { state: false, message: ''}

	async ngOnInit() {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		this.stateService.products$.subscribe((products) => {
			if(products == null){
				this.userService.fetchProductsData()
			} else {
				this.products = products;
			}
		})

	}


	async addProduct()
	{
		const body: SaveProductInterface = {
			id_prod: this.addProductGroup.value.idProd,
			name: this.addProductGroup.value.nameProd,
			productDetails: {
				kcal: this.addProductGroup.value.kcal,
				proteins: this.addProductGroup.value.proteins,
				fats: this.addProductGroup.value.fats,
				carbohydrates: this.addProductGroup.value.carbohydrates,
			}
		}

		const validBody = this.dataValidation(body)

		if(validBody){
			try {
				this.adminService.saveProduct(body)
					.subscribe({
						next: response => {
							this.errorHandler = { state: true, message: response.message }
						},
						error: error => {
							this.errorHandler = { state: true, message: error.message }
						}
					})
			} catch (error) {
				this.errorHandler = {state: true, message: "Błąd przy zapisie"}
				console.log(error)
			}

		}
		else {
			console.log("body is invali,", body)
		}

	}

	dataValidation(data: SaveProductInterface){
		if(data.id_prod == null) {
			this.errorHandler = {state: true, message: "ID produktu nie może być null / 0"};
			return false;
		}
		else if(data.name == null || data.name == "" || !isNaN(Number(data.name))) {
			this.errorHandler = {state: true, message: "Nazwa nie może być null / '' / liczbą"};
			return false;
		}
		else if(data.productDetails.kcal == null) {
			this.errorHandler = {state: true, message: "Kcal nie może być null / 0"};
			return false;
		}
		else if(data.productDetails.proteins == null) {
			this.errorHandler = {state: true, message: "Białko produktu nie może być null / 0"};
			return false;
		}
		else if(data.productDetails.fats == null) {
			this.errorHandler = {state: true, message: "Tłuszcze nie może być null / 0"};
			return false;
		}
		else if(data.productDetails.carbohydrates == null) {
			this.errorHandler = {state: true, message: "Węglowodany nie może być null / 0"};
			return false;
		}

		this.errorHandler = {state: false, message: ''}
		return true
	}
}
