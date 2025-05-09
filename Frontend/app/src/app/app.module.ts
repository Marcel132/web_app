import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { requestDuplicationInterceptor } from '../interceptors/request-duplication.interceptor';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		HttpClientModule
  ],
	exports: [
	],
	providers: [
		AuthService,
		provideHttpClient(withInterceptors([authInterceptor, requestDuplicationInterceptor])),
	]
})
export class AppModule { }
