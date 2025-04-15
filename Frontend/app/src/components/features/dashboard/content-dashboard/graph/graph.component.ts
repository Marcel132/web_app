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
	totalDailyEnergyExpenditure: number = 2000 // Total Daily Energy Expenditure, default value : 2000
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
		private fb: FormBuilder,
	) {

		this.formUserData = this.fb.group({
			sex: [null, Validators.required],
			weight: [null, [Validators.required, Validators.min(1)]],
			age: [null, [Validators.required, Validators.min(1)]],
			height: [null, [Validators.required, Validators.min(1)]],
			pal: [null, Validators.required]
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

		if(typeof window != null){
			const storage = localStorage.getItem("user%package_body_details")
			if(storage){
				const parseData = JSON.parse(storage)
				const parseDataBody = {
					sex: parseData.sex,
					age: parseData.age,
					weight: parseData.weight,
					height: parseData.height,
					pal: parseData.pal,
				}
				this.formUserData.setValue(parseDataBody)

				this.calculateBmiAndBaseMetabolic()
				if(this.bmi != parseData.bmi || this.baseMetabolicRate != parseData.metabolicRate || this.totalDailyEnergyExpenditure != parseData.pal){
					this.saveData()
				}

			} else {
				console.log("LocalStorage is null")
			}
		} else {
			this.errorHandler = {state: true, message: "Nie załadowano danych"}
			console.log(this.errorHandler.message)
			setTimeout(() => {
				this.errorHandler = {state: false, message: ''}
			}, 10000);
		}
	}

	private transformMealData() {
    if (!this.meals || !Array.isArray(this.meals.details)) return;

    const dailyCalories: { [key: string]: number } = {};
		const dailyFats: { [key: string] : number} = {}
		const dailyProteins: { [key: string] : number} = {}
		const dailyCarbohydrates: { [key: string] : number} = {}


    this.meals.details.forEach(detail => {

      const date = new Date(detail.date).toISOString().split('T')[0];
			if (!Array.isArray(detail.meals)) return;
      const totalCalories = detail.meals.reduce((sum, meal) => sum + meal.productDetails.kcal, 0);
			const totalProteins = detail.meals.reduce((sum, meal) => sum + meal.productDetails.proteins, 0)
			const totalFats = detail.meals.reduce((sum, meal) => sum + meal.productDetails.fats, 0)
			const totalCarbohydrates = detail.meals.reduce((sum, meal) => sum + meal.productDetails.carbohydrates, 0)

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
			height: this.formUserData.value.height,
			pal: this.formUserData.value.pal
		}


		if(body.sex == null) this.errorHandler = {state: true, message: 'Nie wybrano płci'}
		else { this.errorHandler = {state: false, message: '' } }
		if(body.age <= 0) this.errorHandler = {state: true, message: 'Twój wiek musi być większy niż 0'}
		else { this.errorHandler = {state: false, message: '' } }
		if(body.height <= 0) this.errorHandler = {state: true, message: 'Twój wzrost musi być większy niż 0'}
		else { this.errorHandler = {state: false, message: '' } }
		if(body.weight <= 0) this.errorHandler = {state: true, message: 'Twoja waga musi być większa niż 0'}
		else { this.errorHandler = {state: false, message: '' } }
		if(body.pal <= 0) this.errorHandler = {state: true, message: 'Wskaźnik PAL musi być wybrany'}
		else { this.errorHandler = {state: false, message: '' } }

		if(body.sex === 'female'){
			this.baseMetabolicRate = ((10 * body.weight) + (6.25 * body.height) - (5 * body.age) - 161)
		}
		else if(body.sex === 'male') {
			this.baseMetabolicRate = ((10 * body.weight) + (6.25 * body.height) - (5 * body.age) + 5)
		}

		const calculateBmit = (body.weight / (body.height / 100)**2)
		const calculateDailyCalorieNeeds = this.baseMetabolicRate * body.pal

		if(calculateBmit != null && calculateBmit > 0){
			this.bmi = parseFloat(calculateBmit.toFixed(2))
		}
		if(calculateDailyCalorieNeeds != null && calculateDailyCalorieNeeds > 0){
			this.totalDailyEnergyExpenditure = parseFloat(calculateDailyCalorieNeeds.toFixed(2))
		}

		this.totalDailyEnergyExpenditure = calculateDailyCalorieNeeds
	}

	saveData() {
		const body = {
			sex: this.formUserData.value.sex,
			age: this.formUserData.value.age,
			weight: this.formUserData.value.weight,
			height: this.formUserData.value.height,
			pal: this.formUserData.value.pal,
			bmi: this.bmi,
			metabolicRate: this.baseMetabolicRate,
			totalDailyEnergyExpenditure: this.totalDailyEnergyExpenditure
		}

		localStorage.setItem("user%package_body_details" , JSON.stringify(body))
		return this.errorHandler = {state: true, message: "Zapisano dane"};
	}
}
