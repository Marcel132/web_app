import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto'

@Component({
    selector: 'app-calories-chart',
		standalone: true,
    imports: [],
    templateUrl: './calories-chart.component.html',
    styleUrl: './calories-chart.component.scss'
})
export class CaloriesChartComponent  implements AfterViewInit{
	@ViewChild('caloriesChart') chartRef! : ElementRef
	@Input() totalDailyEnergyExpenditure!: number
	@Input() mealData!: {
		date: string,
		totalCalories: number,
		totalProteins: number,
		totalCarbohydrates: number,
		totalFats: number
	}[]

	ngAfterViewInit() {
		if (this.mealData && this.mealData.length > 0 && this.chartRef?.nativeElement) {
			this.createChart();
		} else {
			console.error('Brak danych lub elementu canvas!');
		}
	}

	private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    const labels = this.mealData.map(meal => meal.date);
    const data = this.mealData.map(meal => meal.totalCalories);

		const fats = this.mealData.map(detail => detail.totalFats)
		const proteins = this.mealData.map(detail => detail.totalProteins)
		const carbohydrates = this.mealData.map(detail => detail.totalCarbohydrates)

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Spożyte kalorie',
            data: data,
            borderColor: 'blue',
            backgroundColor: 'rgba(173, 216, 230, 0.4)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
          },
          {
            label: 'Dzienne zapotrzebowanie',
            data: new Array(labels.length).fill(this.totalDailyEnergyExpenditure),
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
          },
					{
						label: 'Białka',
						data: proteins,
						borderColor: 'orange',
						backgroundColor: 'rgba(255, 165, 0, 0.4)',
						fill: true,
						tension: 0.4,
						pointRadius: 5,
					},
					{
						label: 'Tłuszcze',
						data: fats,
						borderColor: 'green',
						backgroundColor: 'rgba(255, 165, 0, 0.4)',
						fill: true,
						tension: 0.4,
						pointRadius: 5,
					},
					{
						label: 'Węgle',
						data: carbohydrates,
						borderColor: 'brown',
						backgroundColor: 'rgba(255, 165, 0, 0.4)',
						fill: true,
						tension: 0.4,
						pointRadius: 5,
					},
        ]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)} g`;
              }
            }
          }
        }
      }
    });
  }
}
