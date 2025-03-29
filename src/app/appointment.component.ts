import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from './appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  standalone: false,
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {
  today: string = new Date().toISOString().split('T')[0]; // Today's date
  selectedAppointments: { [key: number]: boolean } = {}; // Track selected bookings
  selectedDate: { [key: number]: string } = {};
  selectedSlot: { [key: number]: string } = {};

  chosenDate: any;
  chosenSlot: any;


  slots = [
    { start: '9:00AM', end: '11:00AM', available: true},
    { start: '11:30AM', end: '1:30PM', available: true},
    { start: '2:00PM', end: '4:00PM', available: true},
    { start: '4:30PM', end: '6:30PM', available: true},
    { start: '7:00PM', end: '9:30PM', available: true}
  ];

  appointments = [
    { id: 1, title: 'Soulful Red', duration: '1 hr', price: 249, image: 'assets/solful-red.JPG' },
    { id: 2, title: 'Orchid Pink', duration: '2 hrs', price: 599, image: 'assets/orch-pink.JPG' },
    { id: 3, title: 'Blissful Blue', duration: '2 hrs', price: 599, image: 'assets/bliss-blue.JPG' },
    { id: 4, title: 'Dreamy Pitch', duration: '2 hr', price: 799, image: 'assets/dreamy-pitch.JPG' },
    { id: 5, title: 'Romantic Red', duration: '2 hrs', price: 999, image: 'assets/romantic-red.JPG' },
    { id: 6, title: 'Misty Mauve', duration: '2 hrs', price: 999, image: 'assets/misty-mauve.JPG' }
  ];

  constructor(private appointmentService: AppointmentService, private router: Router) {
  }

  onDateChange(appointmentId: number, event: any) {
    const selectedDate = event.target.value;
    if (selectedDate) {
      this.chosenDate = selectedDate;
      // Enable only available time slots
      // this.bookingForms[appointmentId].patchValue({ selectedSlot: '' });
    }
  }

  toggleBookingForm(appointmentId: number) {
    this.selectedAppointments[appointmentId] = !this.selectedAppointments[appointmentId];
  }

  submitBooking(appointment: any) {
      //console.log('appointment selected: ', appointment);
      const updatedAppointment = { ...appointment, selectedDate: this.chosenDate, selectedSlot: this.selectedSlot };
      console.log('updated appointment: ', updatedAppointment);

      this.appointmentService.setAppointmentDetails(updatedAppointment);
      this.selectedAppointments[appointment.id] = false;
      this.router.navigate(['/booking-details']);
  }
  selectSlot(appointmentId: number, start: string, end: string) {
    this.selectedSlot[appointmentId] = `${start} - ${end}`;
  }
}
