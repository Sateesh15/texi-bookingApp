<template>
    <div class="dashboard">
        <Navbar />
        <button class="Booking-BT" @click="toggleFormVisibility">Texi Booking</button>
        <!-- Button to toggle display of available drivers -->
        <button class="Drivers-BT" @click="getAvailableDrivers">Show Available Drivers</button>

        <button class="Drivers-BT" @click="getAvailableBookings">Show Available Bookings</button>

        
      <form v-if="showForm" @submit.prevent="submitBooking" class="Booking-form">
        <!-- Booking form fields -->
        <h2>Booking Form</h2>
        <input type="text" v-model="bookingDetails.origin" placeholder="Origin" required>
        <input type="text" v-model="bookingDetails.destination" placeholder="Destination" required>
        <input type="datetime-local" v-model="bookingDetails.pickupTime" required>
        <input type="datetime-local" v-model="bookingDetails.acceptedTime" required>
        <input type="number" v-model="bookingDetails.userId" placeholder="User ID" required>
        <input type="number" v-model="bookingDetails.driverId" placeholder="Driver ID">
        <input type="number" v-model="bookingDetails.price" placeholder="Price">
        <input type="checkbox" v-model="bookingDetails.isConfirmed" id="isConfirmed">
        <label for="isConfirmed">Confirmed</label>
        <button type="submit">Book Taxi</button>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
      <!-- Booking details popup -->
      <div class="popup-overlay" v-if="showBookingDetails">
        <div class="popup">
          <span class="close-button" @click="closePopup">&times;</span>
          <h2>Booking Details</h2>
          <p>Booking ID: {{ bookingDetails.bookingId }}</p>
          <p>User ID: {{ bookingDetails.userId }}</p>
          <p>Origin: {{ bookingDetails.origin }}</p>
          <p>Destination: {{ bookingDetails.destination }}</p>
          <p>Pickup Time: {{ bookingDetails.pickupTime }}</p>
          <p>Accepted Time: {{ bookingDetails.acceptedTime }}</p>
          <p>Price: {{ bookingDetails.price }}</p>
          <p>Confirmed: {{ bookingDetails.isConfirmed }}</p>
        </div>
      </div>

     <!-- Display available drivers as small cards with expandable details -->
    <div v-if="showAvailableDrivers" class="Driver-f">
        <div v-for="driver in drivers" :key="driver.driverId" class="driver-card">
          <div @click="toggleDriverDetails(driver.driverId)" class="driver-name">{{ driver.name }}</div>
          <div v-if="expandedDriverId === driver.driverId" class="driver-details">
            <p>Mobile: {{ driver.mobile }}</p>
            <p>License Number: {{ driver.licenseNumber }}</p>
            <p>License Expiration: {{ driver.licenseExpiration }}</p>
            <p v-if="driver.isAvailable">Available</p>
            <button v-else disabled>Not Available</button>
            <!-- Delete button/icon -->
            <i class="fa-solid fa-trash" @click="deleteDriver(driver.driverId)"></i>
          </div>
        </div>
    </div>

    <div v-if="showAvailableBookings" class="Driver-f">
        <div v-for="Booking in Bookings" :key="Booking.bookingId" class="driver-card">
          <div @click="toggleAvailableBookings(Booking.bookingId)" class="driver-name">{{ Booking.origin }}</div>
          <div v-if="expandedBookingId === Booking.bookingId" class="driver-details">
            <p>Destination: {{ Booking.destination }}</p>
            <p>Pickup Time: {{ Booking.pickupTime }}</p>
            <p>Accepted Time: {{ Booking.acceptedTime }}</p>
            <p v-if="Booking.isConfirmed">IsConfirmed</p>
            <button v-else disabled>Is Confirmed</button>
          </div>
        </div>
    </div>

    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Navbar from '../Navbar.vue';
  import '@fortawesome/fontawesome-free/css/all.css';
  

  export default {
    components: {
    Navbar // Include the Navbar component
  },
    data() {
      return {
        bookingDetails: {
          origin: '',
          destination: '',
          pickupTime: '',
          acceptedTime: '',
          userId: 0,
          driverId: null,
          price: null,
          isConfirmed: false
        },
        showForm: false,
        errorMessage: '',
        showBookingDetails: false, // Flag to toggle booking details popup
        showAvailableDrivers: false, // Add showAvailableDrivers property
        showAvailableBookings: false,
        drivers: [], // Array to store available drivers
        expandedDriverId: null,
        expandedBookingId: null,
        Bookings: []
      };
    },
    methods: {
        toggleFormVisibility() {
      this.showForm = !this.showForm;
      
    },
    getAvailableDrivers() {
        this.showAvailableDrivers = !this.showAvailableDrivers
        if (this.showAvailableDrivers) {
            this.fetchDrivers(); // Hide the form
            
      } 
    },
    getAvailableBookings() {
        this.showAvailableBookings = !this.showAvailableBookings
        if (this.showAvailableBookings) {
            this.fetchBookings(); // Hide the form
            
      } 
    },
      async submitBooking() {
        try {
          const response = await axios.post('https://localhost:7200/api/Bookings', this.bookingDetails);
          console.log(response.data);
          // Show booking details popup after successful booking
          this.showBookingDetails = true;
        } catch (error) {
          console.error(error);
          if (error.response) {
            // Server responded with a non-200 status code
            this.errorMessage = error.response.data.message;
          } else if (error.request) {
            // Request was made but no response was received
            this.errorMessage = 'Server did not respond';
          } else {
            // Something else happened while setting up the request
            this.errorMessage = 'Error occurred while sending the request';
          }
        }
      },
      closePopup() {
        // Close booking details popup
        this.showBookingDetails = false;
      },
      async fetchDrivers() {
      try {
        const response = await axios.get('https://localhost:7200/api/Drivers/availablel-drivers');
        this.drivers = response.data;
        this.showAvailableDrivers = true;
      } catch (error) {
        console.error(error);
        // Handle error while fetching available drivers
      }
     },
     async fetchBookings() {
      try {
        const response = await axios.get('https://localhost:7200/api/Bookings/available-bookings');
        this.Bookings = response.data;
        this.showAvailableBookings = true;
      } catch (error) {
        console.error(error);
        // Handle error while fetching available drivers
      }
     },
     toggleDriverDetails(driverId) {
      if (this.expandedDriverId === driverId) {
        this.expandedDriverId = null; // Collapse if already expanded
      } else {
        this.expandedDriverId = driverId; // Expand if not expanded
      }
    },
    toggleAvailableBookings(bookingId) {
      if (this.expandedBookingId === bookingId) {
        this.expandedBookingId = null; // Collapse if already expanded
      } else {
        this.expandedBookingId = bookingId; // Expand if not expanded
      }
    },
    deleteDriver(driverId) {
    if (confirm("Are you sure you want to delete this driver?")) {
        axios.delete(`https://localhost:7200/api/Drivers/${driverId}`)
            .then(response => {
                // Remove the deleted driver from the drivers array
                this.drivers = this.drivers.filter(driver => driver.driverId !== driverId);
                alert("Driver deleted successfully!");
            })
            .catch(error => {
                console.error(error);
                alert("Failed to delete driver. Please try again later.");
            });
    }
}

    }
  }
  </script>
  
  <style scoped>
  /* Component styles */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .Booking-form{
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin-top: 10%;
  }

  .Booking-form input {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .popup {
    background-color: hsl(160, 4%, 27%);
    padding: 20px;
    border-radius: 5px;
    color: white;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .Booking-form button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color:hsla(160, 100%, 37%, 1);
    color: #fff;
    cursor: pointer;
  }
  
  .Booking-form button:hover {
    background-color: hsl(160deg 70.26% 38.39%);
  }

  .Booking-BT {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color:hsla(160, 100%, 37%, 1);
    color: #fff;
    cursor: pointer;
    margin-top: 10px;
    
  }

  

.driver-card {
    margin-bottom: 10px;
    
  }
  
  .driver-name {
    cursor: pointer;
    font-weight: bold;
    color: black;
  }
  
  .driver-details {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-top: 5px;
    color: black;
    width: fit-content
    
  }
  
  .driver-details p {
    margin: 5px 0;
    
  }
  
  .driver-details button {
    margin-top: 10px;
    
  }

  .Drivers-BT{
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: hsla(160, 100%, 37%, 1);
    color: #fff;
    cursor: pointer;
    margin-top: auto;
    margin-left: 1%;
    
    
  }

  .Driver-f {
    margin-top: 2%;
  }
  .fas, .fa-solid {
  position: sticky;
    font-weight: 900;
    left: 90%;
    transform: translateY(-50%);
    cursor: pointer;
    color: red;
    font-size: 16px;

  }

  </style>
  