import { Routes } from '@angular/router';
import { DashboardComponent } from './core/routes/dashboard/dashboard.component';
import { LoginComponent } from './core/routes/login/login.component';

export const routes: Routes = [
    {
        path: "", component: LoginComponent
    },
    {
        path: "dashboard", component: DashboardComponent
    }
];
