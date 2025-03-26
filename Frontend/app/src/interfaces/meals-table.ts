export interface MealsTable {
	id_prod: number,
	name: string,
	weight: number,
	productDetails: {
		kcal: number,
		proteins: number,
		fats: number,
		carbohydrates: number,
	}
	showDescription?: boolean
	editMode?: boolean
}
