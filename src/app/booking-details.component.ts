import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';
import { BookingDetailsService } from './booking-details.service';
import { AppointmentService } from './appointment.service';

@Component({
  selector: 'booking-details',
  templateUrl: './booking-details.component.html',
  standalone: false,
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent {
  today: string = new Date().toISOString().split('T')[0];
  peopleCount: number = 1;
  bookingForm: FormGroup;
  selectedDecors: any[] = []; // Stores selected decorations
  occasions = ['Anniversary', 'Birthday', 'Bride to be' , 'Mom to be', 'Groom to be' , 'Date' ,'Other'];
  cakes = [
    { name: 'Classic Vanilla 1/2 KG', price: 400},
    { name: 'Classic Vanilla 1 KG', price: 650},
    { name: 'Choco Vannilla 1/2 KG', price: 450},
    { name: 'Choco Vannilla 1 KG', price: 700},
    { name: 'Strawberry Delight 1/2 KG', price: 400},
    { name: 'Strawberry Delight 1 KG', price: 650},
    { name: 'Butter Scotch 1/2 KG', price: 400},
    { name: 'Butter Scotch 1 KG', price: 650},
    { name: 'Fresh PineApple 1/2 KG', price: 450},
    { name: 'Fresh PineApple 1 KG', price: 700},
    { name: 'Black Current 1/2 KG', price: 450},
    { name: 'Black Current 1 KG', price: 700},
    { name: 'Red Velvet 1/2 KG', price: 450},
    { name: 'Red Velvet 1/2 KG', price: 750},
    { name: 'Black Forest', price: 450},
    { name: 'Black Forest', price: 750},
    { name: 'Oreo', price: 450},
    { name: 'Oreo', price: 750}
  ];

  rooms = [
    { name: 'Gala Red', price: 1000},
    { name: 'Dreamy Peach', price: 1000},
    { name: 'Golden serenity', price: 1200}
  ];

  specialDecor = [
    { name: 'Fog Entry', price: 299, image: 'assets/fog_entry.png' },
    { name: 'Balloon Decoration', price: 249, image: 'assets/Matka.png' },
    { name: 'DSLR Photo / Video Shoot', price: 499, image: 'assets/Matka.png' },
    { name: 'LED Lights Setup', price: 299, image: 'assets/Matka.png' },
    { name: 'Red Carpet Entry', price: 499, image: 'assets/Matka.png' },
    { name: 'Rose Petal decor', price: 99, image: 'assets/Matka.png' },
    { name: 'Party Poopers', price: 99, image: 'assets/Matka.png' },
    { name: 'PS5 Gaming set up with 2 Controller', price: 399, image: 'assets/Matka.png' }
  ];

  cart: any[] = [];
  total = 0;
  selectedCake: any = null;
  totalAmount = 0;
  peoplePrice = 0;
  
  availableSlots = [
    { start: '9:00am', end: '11:00am' },
    { start: '11:30am', end: '1:30pm' },
    { start: '2:00pm', end: '4:00pm' },
    { start: '4:30pm', end: '6:30pm' },
    { start: '7:00pm', end: '9:30pm' },
  ];
  filteredSlots: { start: string; end: string }[] = [];
  //today: string = '';
  formValid: boolean = false;
  selectedAppointment: any;
  selectedSlot: any;

  constructor(private fb: FormBuilder, private router: Router, private bookingDetailsService : BookingDetailsService, private appointmentService: AppointmentService) {

    this.selectedAppointment = this.appointmentService.getAppointmentDetails();
    this.selectedSlot = Object.values(this.selectedAppointment?.selectedSlot || {})[0] || 'none';

    this.bookingForm = this.fb.group({
      bookingName: ['', Validators.required],
      whatsappNumber: ['', Validators.required],
      email: ['', Validators.required],
      occasion: ['', Validators.required],
      specialPerson: [''],
      message: [''],
      peopleCount: [1],
    });
    this.updateTotal();
  }

  ngOnInit() {
    const today = new Date();
    this.today = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    this.bookingForm.patchValue({ selectedDate: this.today });
    this.filterSlots(this.today);
  }

  onDateChange(event: any) {
    const selectedDate = event.target.value;
    this.filterSlots(selectedDate);
  }

  filterSlots(selectedDate: string) {
    const now = new Date();
    const isToday = selectedDate === this.today;
    this.filteredSlots = this.availableSlots.filter((slot) => {
      if (!isToday) return true;

      const slotTime = new Date();
      const [hours, minutes] = slot.start.split(':').map(Number);
      slotTime.setHours(hours, minutes, 0, 0);

      return slotTime > now;
    });
  }

  addToCart(item: any) {
    this.cart.push(item);
    this.total += item.price;
  }

  proceedToPay() {
    alert('Proceeding to payment with total: Rs. ' + this.total);
  }

  increment() {
    let value = this.bookingForm.get('peopleCount')?.value || 0;
    this.bookingForm.get('peopleCount')?.setValue(value + 1);
    this.updateTotal();
  }
  
  decrement() {
    let value = this.bookingForm.get('peopleCount')?.value || 0;
    if (value > 1) {
      this.bookingForm.get('peopleCount')?.setValue(value - 1);
      this.updateTotal();
    }
  }

  onCakeSelect(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const [name, price] = selectedValue.split('-');
      this.selectedCake = { name, price: Number(price) };
    } else {
      this.selectedCake = null;
    }
    this.updateTotal();
  }

  toggleDecorSelection(decor: any, event: any) {
    event.stopPropagation();
    const decorItem = event.currentTarget as HTMLElement;
    const checkbox = decorItem.querySelector('input[type="checkbox"]') as HTMLInputElement;

    if (checkbox) {
      checkbox.checked = !checkbox.checked; // Manually toggle checkbox state
    }

    // Apply selection logic
    if (checkbox?.checked) {
     this.selectedDecors.push(decor);
    } else {
     this.selectedDecors = this.selectedDecors.filter(item => item.name !== decor.name);
    }

  this.updateTotal();
  }

  isSelected(decor: any): boolean {
    return this.selectedDecors.some(item => item.name === decor.name);
  }
  
  updateTotal() {
    this.peopleCount = this.bookingForm.get('peopleCount')?.value || 1;
    this.peoplePrice = this.peopleCount <= 2 ? 0 : (this.peopleCount - 2) * 150;
    
    let cakePrice = this.selectedCake ? this.selectedCake.price : 0;
    let decorPrice = this.selectedDecors.reduce((total, decor) => total + decor.price, 0);
    let roomPrice = this.selectedAppointment ? this.selectedAppointment.price : 0;
    this.totalAmount = this.peoplePrice + cakePrice + decorPrice + roomPrice;
  }

  onSubmit() {
    if (this.bookingForm.invalid) {
      console.log("Please fill in all required fields!");
      return;
    }

    const bookingDetails = {
      ...this.bookingForm.value,
      selectedCake: this.selectedCake,
      selectedDecors: this.selectedDecors,
      totalAmount: this.totalAmount,
      selectedDate: this.selectedAppointment?.selectedDate,
      selectedSlot: this.selectedSlot,
      selectedRoom: this.selectedAppointment?.title,
      selectedRoomPrice: this.selectedAppointment?.price
    };

    console.log('booking details: ', bookingDetails);
    this.sendEmail(bookingDetails);
  }

  sendEmail(bookingDetails: any) {
      const serviceID = 'service_2eie2bp';
      const templateID = 'template_tln5saz';
      const publicKey = 'eS0oAY2IJZYuBrpLP';
      const templateParams = {
        to_email: bookingDetails.email,
        booking_name: bookingDetails.bookingName,
        whatsapp_number: bookingDetails.whatsappNumber,
        occasion: bookingDetails.occasion,
        people_count: bookingDetails.peopleCount,
        special_person_name: bookingDetails.specialPerson,
        message: bookingDetails.message,
        selected_date: bookingDetails.selectedDate,
        selected_slot: bookingDetails.selectedSlot,
        selected_room_type: bookingDetails.selectedRoom,
        selected_room_price: bookingDetails.selectedRoomPrice,
        selected_cake: bookingDetails.selectedCake?.name || 'None',
        cake_price: bookingDetails.selectedCake?.price || '0',
        selected_decor: bookingDetails.selectedDecors?.map((decor: { name: string }) => decor.name).join(', ') || 'None',
        decor_price: bookingDetails.selectedDecors?.reduce((sum: number, decor: { price: number }) => sum + decor.price, 0) || 0,
        total_amount: bookingDetails.totalAmount
      };
      // Store data in the service
      this.bookingDetailsService.setBookingDetails(templateParams);
  
      // emailjs.send(serviceID, templateID, templateParams, publicKey)
      //   .then(response => {
      //     console.log('Email sent successfully!', response);
      //     this.router.navigate(['/booking-summary']);
      //   })
      //   .catch(error => {
      //     console.error('Email sending failed:', error);
      //     alert('Error sending email. Please try again.');
      //   });
  }



  slots = [
    { start: '10:00 AM', end: '12:00 PM', available: false },
    { start: '12:30 PM', end: '2:30 PM', available: false },
    { start: '3:00 PM', end: '5:00 PM', available: false },
    { start: '5:30 PM', end: '7:30 PM', available: true },
    { start: '8:00 PM', end: '10:00 PM', available: true }
  ];
  

  onBookNow() {
    if (this.bookingForm.valid) {
      alert("Booking Confirmed: " + JSON.stringify(this.bookingForm.value));
    }
  }
  
}
