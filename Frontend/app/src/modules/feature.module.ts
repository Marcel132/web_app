import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../components/features/auth-container/auth.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		AuthModule,
  ],
	exports: [
		AuthModule
	]
})
export class FeatureModule { }
