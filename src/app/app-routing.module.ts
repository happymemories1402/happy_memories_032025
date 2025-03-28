import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingSummaryComponent } from './booking-summary.component';
import { BookingDetailsComponent } from './booking-details.component';

const routes: Routes = [
  { path: '', component: BookingDetailsComponent }, // ✅ Default Route (loads when opening localhost:4200)
  { path: 'booking-summary', component: BookingSummaryComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
