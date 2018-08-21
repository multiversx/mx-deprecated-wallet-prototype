import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NodeComponent } from './pages/node/node.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { StatsComponent } from './pages/stats/stats.component';
import { SearchComponent } from './pages/search/search.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoggerComponent } from './layout/logger/logger.component';
import {HelpComponent} from './pages/help/help.component';

const routes: Routes = [
  {
    path: 'node',
    component: NodeComponent,
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
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
    path: 'help',
    component: HelpComponent
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'path-logger',
    component: LoggerComponent,
    outlet: 'logger'
  },
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/welcome'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {
}
