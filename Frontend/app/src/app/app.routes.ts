import { Routes } from '@angular/router';
import { LoginComponent } from '../components/features/auth-container/login/login.component';
import { RegisterComponent } from '../components/features/auth-container/register/register.component';
import { DashboardComponent } from '../components/features/dashboard/dashboard.component';

export const routes: Routes = [
	{path: '', redirectTo: 'login', pathMatch: 'full'},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegisterComponent},
	{path: 'dashboard', component: DashboardComponent}
];
