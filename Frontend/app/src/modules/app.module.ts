import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/shared/header/header.component';
import { FooterComponent } from '../components/shared/footer/footer.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		HeaderComponent,
		FooterComponent,
  ],
	exports: [
		HeaderComponent,
		FooterComponent,
	]
})
export class AppModule { }
