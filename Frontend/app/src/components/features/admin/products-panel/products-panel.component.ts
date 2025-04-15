import { Component } from '@angular/core';
import { StateService } from '../../../../services/state.service';
import { Product } from '../../../../interfaces/product';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-panel',
  standalone: true,
  imports: [
		CommonModule
	],
  templateUrl: './products-panel.component.html',
  styleUrl: './products-panel.component.scss'
})
export class ProductsPanelComponent {

	constructor(
		private stateService: StateService,
		private userService: UserService
	) {}

	products: Product[] | null = null;

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

		console.log(this.products);
	}
}
