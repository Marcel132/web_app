export interface ProductSaveModel {
	id_prod: number,
	name: string,
	productDetails: {
		kcal: number,
		proteins: number,
		fats: number,
		carbohydrates: number,
	}
}
