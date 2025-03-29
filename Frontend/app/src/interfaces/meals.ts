import { MealsTable } from "./meals-table"

export interface Meals {
	id: string,
	email: string,
	details: [
		{
			showDescription: false
			title: string,
			description: string,
			date:  Date,
			meals: MealsTable[]
		}
	]
}
