import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NodeComponent } from './pages/node/node.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { StatsComponent } from './pages/stats/stats.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  {
    path: 'node',
    component: NodeComponent,
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
    redirectTo: '/node',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/node'
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
