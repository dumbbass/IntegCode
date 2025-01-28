import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    // your components
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // other modules
  ],
  providers: [],
  bootstrap: [/* your main component */]
})
export class AppModule { } 