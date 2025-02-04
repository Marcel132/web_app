import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../modules/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		SharedModule,
		HttpClientModule,
		LoginComponent,
		RegisterComponent,
  ],
	exports: [

	]
})
export class AuthModule { }
