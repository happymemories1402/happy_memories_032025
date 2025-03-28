import { Component } from '@angular/core';
import { BookingDetailsService } from './booking-details.service';

@Component({
  selector: 'booking-summary',
  templateUrl: './booking-summary.component.html',
  standalone: false,
  styleUrls: ['./booking-summary.component.css']
})
export class BookingSummaryComponent {
  bookingData: any;

  constructor(private bookingdetailsService : BookingDetailsService) {
    this.bookingData = bookingdetailsService.getBookingDetails();
    
  }

}