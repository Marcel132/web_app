import { Component, OnInit } from '@angular/core';
import { StateService } from '../../../../../services/state.service';
import { UserService } from '../../../../../services/user.service';
import { Meals } from '../../../../../interfaces/meals';
import { CaloriesChartComponent } from "./calories-chart/calories-chart.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
		CaloriesChartComponent,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
	],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnInit {

	meals: Meals | null = null
	transformedMealsData: any[] = []
	dailyCalorieNeeds: number = 2000
	formUserData: FormGroup<any>

	baseMetabolicRate: number = 0;
	bmi = 0;
	errorHandler = {
		state: false,
		message: ''
	}

	constructor(
		private stateService: StateService,
		private userService: UserService,
		private fb: FormBuilder
	) {
		this.formUserData = this.fb.group({
			sex: [null, Validators.required],
			weight: [0, [Validators.required, Validators.min(1)]],
			age: [0, [Validators.required, Validators.min(1)]],
			height: [0, [Validators.required, Validators.min(1)]]
		})
	}


	ngOnInit(): void {
		this.stateService.userMealsSubject$.subscribe({
			next: meals => {
				if(meals == null){
					this.userService.fetchUserMealsData();
				} else {
					this.meals = meals
					this.transformMealData()
				}
			},
			error: err => {
				console.log('Error fetching meals: ', err)
			}
		})

	}

	private transformMealData() {
    if (!this.meals || !Array.isArray(this.meals.details)) return;

    const dailyCalories: { [key: string]: number } = {};
		const dailyFats: { [key: string] : number} = {}
		const dailyProteins: { [key: string] : number} = {}
		const dailyCarbohydrates: { [key: string] : number} = {}


    this.meals.details.forEach(detail => {

			// let totalFats: number = 0
			// let totalCarbohydrates: number = 0
			// let totalProteins: number = 0

      const date = new Date(detail.date).toISOString().split('T')[0];
			if (!Array.isArray(detail.meals)) return;
      const totalCalories = detail.meals.reduce((sum, meal) => sum + meal.productDetails.kcal, 0);
			const totalProteins = detail.meals.reduce((sum, meal) => sum + meal.productDetails.proteins, 0)
			const totalFats = detail.meals.reduce((sum, meal) => sum + meal.productDetails.fats, 0)
			const totalCarbohydrates = detail.meals.reduce((sum, meal) => sum + meal.productDetails.carbohydrates, 0)


			// detail.meals.map(details => {
				// 	totalFats += details.productDetails.fats
				// })
				// detail.meals.map(details => {
					// 	totalProteins += details.productDetails.proteins
					// })
					// detail.meals.map(details => {
						// 	totalCarbohydrates += details.productDetails.carbohydrates
						// })

						if (!dailyCalories[date])
							{
								dailyCalories[date] = 0;
							}
							dailyCalories[date] += totalCalories;

							if(!dailyFats[date])
								{
									dailyFats[date] = 0
								}
								dailyFats[date] += totalFats

								if(!dailyProteins[date])
									{
										dailyProteins[date] = 0
									}
									dailyProteins[date] += totalProteins

									if(!dailyCarbohydrates[date])
										{
											dailyCarbohydrates[date] = 0
										}
										dailyCarbohydrates[date] += totalCarbohydrates


									});

									this.transformedMealsData = Object.keys(dailyCalories).map(date => ({
										date,
										totalCalories: dailyCalories[date],
			totalFats: dailyFats[date],
			totalProteins: dailyProteins[date],
			totalCarbohydrates: dailyCarbohydrates[date],
    }));
		console.log(this.transformedMealsData)
  }

	calculateBmiAndBaseMetabolic() {
		const body = {
			sex: this.formUserData.value.sex,
			age: this.formUserData.value.age,
			weight: this.formUserData.value.weight,
			height: this.formUserData.value.height
		}
		console.log(body)

		if(body.sex == null) this.errorHandler = {state: true, message: 'Nie wybrano płci'}
		else { this.errorHandler = {state: false, message: '' } }
		if(body.age <= 0) this.errorHandler = {state: true, message: 'Twój wiek musi być większy niż 0'}
		else { this.errorHandler = {state: false, message: '' } }
		if(body.height <= 0) this.errorHandler = {state: true, message: 'Twój wzrost musi być większy niż 0'}
		else { this.errorHandler = {state: false, message: '' } }
		if(body.weight <= 0) this.errorHandler = {state: true, message: 'Twoja waga musi być większa niż 0'}
		else { this.errorHandler = {state: false, message: '' } }

		if(body.sex === 'female'){
			this.baseMetabolicRate = ((10 * body.weight) + (6.25 * body.height) - (5 * body.age) - 161)
		}
		else if(body.sex === 'male') {
			this.baseMetabolicRate = ((10 * body.weight) + (6.25 * body.height) - (5 * body.age) + 5)
		}

		const calculateBmit = (body.weight / (body.height / 100)**2)
		this.bmi = parseFloat(calculateBmit.toFixed(2))
	}

	saveData() {
		const body = {
			sex: this.formUserData.value.sex,
			age: this.formUserData.value.age,
			weight: this.formUserData.value.weight,
			height: this.formUserData.value.height,
			bmi: this.bmi,
			metabolicRate: this.baseMetabolicRate
		}

		localStorage.setItem("user%package_body_details" , JSON.stringify(body))
	}
}
