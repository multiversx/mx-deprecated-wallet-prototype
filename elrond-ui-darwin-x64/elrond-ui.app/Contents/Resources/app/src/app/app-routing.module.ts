import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './pages/client/client.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { StatsComponent } from './pages/stats/stats.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  {
    path: 'client',
    component: ClientComponent,
  },
  {
    path: 'operations',
    component: OperationsComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: '',
    redirectTo: '/client',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/client',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/client'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
