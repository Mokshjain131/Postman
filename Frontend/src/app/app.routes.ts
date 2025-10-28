import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryComponent } from './pages/history/history.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ApiAnalyticsComponent } from './pages/analytics/api-analytics/api-analytics.component';
import { GeneralAnalyticsComponent } from './pages/analytics/general-analytics/general-analytics.component';
import { ApiRequestComponent } from './features/api-tester/api-request/api-request.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'about', component: AboutComponent },
	{ path: 'contact', component: ContactComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'history', component: HistoryComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'analytics/api', component: ApiAnalyticsComponent },
	{ path: 'analytics/general', component: GeneralAnalyticsComponent },
	{ path: 'tester', component: ApiRequestComponent },
	{ path: '**', component: NotFoundComponent },
];
