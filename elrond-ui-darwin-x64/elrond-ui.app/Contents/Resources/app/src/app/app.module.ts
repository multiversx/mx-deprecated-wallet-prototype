import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { StatsComponent } from './pages/stats/stats.component';
import { SearchComponent } from './pages/search/search.component';
import { ClientComponent } from './pages/client/client.component';
import { LoggerComponent } from './layout/logger/logger.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavigationComponent,
    OperationsComponent,
    StatsComponent,
    SearchComponent,
    ClientComponent,
    LoggerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
