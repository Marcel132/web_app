import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {

	private translations : { [key: string]: string } = {
		"free": "Darmowy",
		"premium": "Premium",
		'active': 'Aktywny',
		"inactive": "Nieaktywny",
		"unpaid": "Nieopłacone",
		"paid": "Opłacone",
		"male": "Mężczyzna",
		"female": "Kobieta",
	}

	transform(value: string): string {
		if(!value) return '';
		return this.translations[value.toLowerCase()] || value
	}

}
