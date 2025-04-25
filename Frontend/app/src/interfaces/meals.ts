import { MealsTableInterface } from "./meals-table"

export interface MealsInterface {
	id: string,
	email: string,
	details: [
		{
			showDescription: false
			title: string,
			id: string,
			description: string,
			date:  Date,
			meals: MealsTableInterface[]
		}
	]
}
