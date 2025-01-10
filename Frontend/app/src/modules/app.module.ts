import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';
import { FeatureModule } from './feature.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		SharedModule,
		FeatureModule,
		HttpClientModule
  ],
	exports: [
		SharedModule,
		FeatureModule,
	],
	providers: [
		AuthService
	]
})
export class AppModule { }
