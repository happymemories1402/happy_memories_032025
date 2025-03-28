import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingDetailsService {
  private bookingDetails: any = null;

  setBookingDetails(details: any) {
    this.bookingDetails = details;
  }

  getBookingDetails() {
    return this.bookingDetails;
  }

  clearBookingDetails() {
    this.bookingDetails = null;
  }
}
