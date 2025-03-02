import { Routes } from '@angular/router';
import { LoginComponent } from '../components/features/auth-container/login/login.component';
import { RegisterComponent } from '../components/features/auth-container/register/register.component';
import { DashboardComponent } from '../components/features/dashboard/dashboard.component';
import { authGuard } from '../guards/auth.guard';
import { CalculatorComponent } from '../components/features/dashboard/content-dashboard/calculator/calculator.component';
import { AuthContainerComponent } from '../components/features/auth-container/auth-container.component';
import { ContentDashboardComponent } from '../components/features/dashboard/content-dashboard/content-dashboard.component';
import { AccountDashboardComponent } from '../components/features/dashboard/content-dashboard/account-dashboard/account-dashboard.component';
import { GraphComponent } from '../components/features/dashboard/content-dashboard/graph/graph.component';
import { SettingsComponent } from '../components/features/dashboard/content-dashboard/settings/settings.component';

export const routes: Routes = [
	{path: '', redirectTo: 'home', pathMatch: 'full'},
	{
		path: 'home',
		component: DashboardComponent,
		children:
		[
			{path: '', component: ContentDashboardComponent, children: [
				{path: 'forms', component: AuthContainerComponent, children: [
					{path: 'register', component: RegisterComponent},
					{path: 'login', component: LoginComponent},
				]},
				{path: 'calculator', component: CalculatorComponent},
				{path: 'account', component: AccountDashboardComponent},
				{path: 'graph', component: GraphComponent},
				{path: 'settings', component: SettingsComponent}
			]},
		]
	}
];
