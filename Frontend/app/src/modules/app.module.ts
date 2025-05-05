import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';
import { FeatureModule } from './feature.module';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { requestDuplicationInterceptor } from '../interceptors/request-duplication.interceptor';



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
		AuthService,
		provideHttpClient(withInterceptors([authInterceptor, requestDuplicationInterceptor])),
	]
})
export class AppModule { }
