import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/shared/header/header.component';
import { FooterComponent } from '../components/shared/footer/footer.component';
import { LogoComponent } from '../components/shared/logo/logo.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		HeaderComponent,
		FooterComponent,
		LogoComponent,
  ],
	exports: [
		CommonModule,
		HeaderComponent,
		FooterComponent,
		LogoComponent,
	]
})
export class SharedModule { }
