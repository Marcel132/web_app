import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { requestDuplicationInterceptor } from '../interceptors/request-duplication.interceptor';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/app.state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		HttpClientModule,
		StoreModule.forRoot(reducers),
		StoreDevtoolsModule.instrument({ maxAge: 25}),
  ],
	exports: [
	],
	providers: [
		AuthService,
		provideHttpClient(withInterceptors([authInterceptor, requestDuplicationInterceptor])),
	]
})
export class AppModule { }
