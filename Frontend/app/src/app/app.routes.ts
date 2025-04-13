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
import { MealsComponent } from '../components/features/dashboard/content-dashboard/meals/meals.component';
import { AdminComponent } from '../components/features/admin/admin.component';
import { ProductsPanelComponent } from '../components/features/admin/products-panel/products-panel.component';
import { AdminPanelComponent } from '../components/features/admin/admin-panel/admin-panel.component';
import { UsersPanelComponent } from '../components/features/admin/users-panel/users-panel.component';

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
				{path: 'calculator', loadComponent: () => import('../components/features/dashboard/content-dashboard/calculator/calculator.component').then(m => m.CalculatorComponent)},
				{path: 'meals', loadComponent: () => import('../components/features/dashboard/content-dashboard/meals/meals.component').then(m => m.MealsComponent)},
				{path: 'graph', component: GraphComponent},
				{path: 'account', component: AccountDashboardComponent},
				{path: 'settings', component: SettingsComponent}
			]},
		]
	},
	{
		path: 'admin',
		component: AdminComponent,
		canActivate: [authGuard],
		children: [
			{path: '', component: AdminPanelComponent},
			{path: 'products/panel', component: ProductsPanelComponent},
			{path: 'users/panel', component: UsersPanelComponent},
		]
	}
];
