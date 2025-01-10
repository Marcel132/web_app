import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../modules/shared.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		SharedModule,
		HttpClientModule,
  ],
	exports: [

	]
})
export class AuthModule { }
