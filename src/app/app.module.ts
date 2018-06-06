import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { NodeDataService } from './services/node-data.service';

import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { StatsComponent } from './pages/stats/stats.component';
import { SearchComponent } from './pages/search/search.component';
import { NodeComponent } from './pages/node/node.component';
import { LoggerComponent } from './layout/logger/logger.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

import {StompConfig, StompService} from '@stomp/ng2-stompjs';


const stompConfig: StompConfig = {
  // Which server?
  url: 'ws://127.0.0.1:15674/socket',

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: true
};



@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavigationComponent,
    OperationsComponent,
    StatsComponent,
    SearchComponent,
    NodeComponent,
    LoggerComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    ArchwizardModule,
    NgSelectModule,
    FormsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    NodeDataService,
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
