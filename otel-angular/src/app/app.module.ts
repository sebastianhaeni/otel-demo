import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {
  CompositePropagatorModule,
  OpenTelemetryInterceptorModule,
  OtelColExporterModule
} from '@jufab/opentelemetry-angular-interceptor';
import {environment} from 'src/environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OpenTelemetryInterceptorModule.forRoot(environment.opentelemetryConfig),
    OtelColExporterModule,
    CompositePropagatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
