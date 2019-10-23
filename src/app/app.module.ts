import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import Calculator from './calculator.component';
import About from './about.component';

@NgModule({
  declarations: [AppComponent, Calculator, About],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
