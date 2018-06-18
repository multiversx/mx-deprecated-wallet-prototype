import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NodeDataService } from './services/node-data.service';
import { ToastrMessageService } from './services/toastr.service';

import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { StatsComponent } from './pages/stats/stats.component';
import { SearchComponent } from './pages/search/search.component';
import { NodeComponent } from './pages/node/node.component';
import { LoggerComponent } from './layout/logger/logger.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { IsLoadingComponent } from './components/is-loading/is-loading.component';
import { LoadingService } from './services/loading.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
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
    IsLoadingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    ArchwizardModule,
    NgSelectModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot(),
    PerfectScrollbarModule
  ],
  providers: [
    NodeDataService,
    ToastrMessageService,
    LoadingService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
