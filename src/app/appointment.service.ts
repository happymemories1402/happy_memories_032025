import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {

  private selectedAppointmentDetails: any = null;

  setAppointmentDetails(details: any) {
    this.selectedAppointmentDetails = details;
  }

  getAppointmentDetails() {
    return this.selectedAppointmentDetails;
  }

} 