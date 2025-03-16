import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanHandler',
  standalone: true
})
export class BooleanHandlerPipe implements PipeTransform {

	private transforming(value: boolean): string {
		if(value){
			return 'Włączone'
		} else {
			return 'Wyłączone'
		}
	}

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.transforming(value as boolean)
  }

}
