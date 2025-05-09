import { MealModel } from "./meal.model"

export interface UserMealsModel {
	id: string,
	email: string,
	details: [
		{
			showDescription: false
			title: string,
			id: string,
			description: string,
			date:  Date,
			meals: MealModel[]
		}
	]
}
