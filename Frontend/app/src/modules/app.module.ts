import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';
import { FeatureModule } from './feature.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		SharedModule,
		FeatureModule,
  ],
	exports: [
		SharedModule,
		FeatureModule,
	]
})
export class AppModule { }
