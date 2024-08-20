<template>
  <Navbar />
  <div class="dashboard">  
    <div class="left-side">
      <MapComponent @update-origin="updateOrigin" @update-destination="updateDestination" @price-updated="handlePriceUpdate" ref="map" />
    </div>
    <div class="right-side">
      <button class="Booking-BT" @click="toggleFormVisibility">Taxi Booking</button>
      <button class="Drivers-BT" @click="getAvailableDrivers">Show Available Drivers</button>
      <button class="Drivers-BT" @click="getAvailableBookings">Show Available Bookings</button>

      <form v-if="showForm" @submit.prevent="submitBooking" class="Booking-form">
        <h2>Booking Form</h2>
        <label for="origin">Origin:</label>
        <input type="text" id="origin" v-model="bookingDetails.origin" placeholder="Enter origin" required @input="updateOriginManually">
      
        <label for="destination">Destination:</label>
        <input type="text" id="destination" v-model="bookingDetails.destination" placeholder="Enter destination" required @input="updateDestinationManually">

        <label for="vehicle-type">Vehicle Type:</label>
        <select id="vehicle-type" v-model="bookingDetails.vehicleType" @change="updateVehicleType">
          <option value="bike">Bike</option>
          <option value="auto">Auto</option>
          <option value="cab">Cab</option>
        </select>
      
        <label for="driver">Driver:</label>
        <input type="text" id="driver" :value="driverName" placeholder="Driver" readonly>
      
        <label for="price">Price:</label>
        <input type="text" id="price" v-model="bookingDetails.price" placeholder="Enter price" readonly>
      
        <button type="submit">Book Taxi</button>
      </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>  
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

    <div v-if="showAvailableDrivers" class="drivers-container">
      <div v-for="driver in drivers" :key="driver.driverId" class="driver-card" :class="getCardClass(driver.driverId)">
        <div @click="toggleDriverDetails(driver.driverId)" class="driver-name">{{ driver.name }}</div>
        <div v-if="expandedDriverId === driver.driverId" class="driver-details">
          <p>Mobile: {{ driver.mobile }}</p>
          <p>License Number: {{ driver.licenseNumber }}</p>
          <p>License Expiration: {{ driver.licenseExpiration }}</p>
          <p v-if="driver.isAvailable">Available</p>
          <button v-else disabled>Not Available</button>
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
          <p v-if="Booking.isConfirmed">Is Confirmed</p>
          <button v-else disabled>Is Confirmed</button>
          <i class="fa-solid fa-trash" @click="deleteBooking(Booking.bookingId)"></i>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../Navbar.vue';
import MapComponent from './MapComponent.vue';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  components: {
    Navbar,
    MapComponent,
  },
  data() {
    return {
      bookingDetails: {
        origin: '',
        destination: '',
        pickupTime: '',
        acceptedTime: '',
        userId: localStorage.getItem('userId') || '',
        driverId: null,
        price: 0,
        isConfirmed: false,
        vehicleType: "bike", // Default vehicle type
      },
      showForm: false,
      errorMessage: '',
      showBookingDetails: false,
      showAvailableDrivers: false,
      showAvailableBookings: false,
      drivers: [],
      expandedDriverId: null,
      expandedBookingId: null,
      Bookings: [],
      userId: localStorage.getItem('userId') || '',
    };
    
  },
  computed: {
    // Computed property to get the driver's name based on the driver ID
    driverName() {
      const driver = this.drivers.find(driver => driver.driverId === this.bookingDetails.driverId);
      return driver ? driver.name : 'No driver assigned';
    }
  },
  methods: {   
    toggleFormVisibility() {
      this.showForm = !this.showForm;
      this.showAvailableDrivers = false;
      this.showAvailableBookings = false;
      if (this.showForm) {
        this.setCurrentDateTime();
        this.fetchDrivers1(); // Fetch available drivers when the form is shown
        
      }
    },
    updateVehicleType() {
      this.$refs.map.bookingDetails.vehicleType = this.bookingDetails.vehicleType;
      this.$refs.map.calculatePriceFromCoordinates(this.$refs.map.destination);
    },
    autoFillDriverId() {
        const availableDrivers = this.drivers.filter(driver => driver.isAvailable);
        if (availableDrivers.length > 0) {
           const randomIndex = Math.floor(Math.random() * availableDrivers.length);
           const randomDriver = availableDrivers[randomIndex];
           this.bookingDetails.driverId = randomDriver.driverId;
           this.bookingDetails.isConfirmed = true;
       } else {
              this.errorMessage = 'No available drivers at the moment';
            }
    },

    async fetchDrivers1() {
      try {
        const response = await axios.get('https://localhost:7200/api/Drivers/availablel-drivers');
        this.drivers = response.data;
        this.autoFillDriverId(); // Auto-fill the driver ID field
      } catch (error) {
        console.error(error);
      }
    },

    setCurrentDateTime() {
      const now = new Date().toISOString().slice(0, 16);
      this.bookingDetails.pickupTime = now;
      this.bookingDetails.acceptedTime = now;
    },
    getAvailableDrivers() {
      this.showAvailableDrivers = !this.showAvailableDrivers;
      this.showAvailableBookings = false;
      this.showForm = false;
      if (this.showAvailableDrivers) {
        this.fetchDrivers();
      }
    },
    getAvailableBookings() {
      this.showAvailableBookings = !this.showAvailableBookings;
      this.showAvailableDrivers = false;
      this.showForm = false;
      if (this.showAvailableBookings) {
        this.fetchBookings();
      }
    },
    async fetchMapData(address) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          return { lat, lon };
        }
        return null;
      } catch (error) {
        console.error('Error fetching map data:', error);
        return null;
      }
    },

    async updateOriginManually() {
      const origin = this.bookingDetails.origin;
      if (origin.trim() !== '') {
        const mapData = await this.fetchMapData(origin);
        if (mapData) {
          this.$refs.map.updateOrigin(mapData.lat, mapData.lon);
        } else {
          console.error('No map data found for the origin address:', origin);
        }
      }
    },

    async updateDestinationManually() {
      const destination = this.bookingDetails.destination;
      if (destination.trim() !== '') {
        const mapData = await this.fetchMapData(destination);
        if (mapData) {
          this.$refs.map.updateDestination(mapData.lat, mapData.lon);
        } else {
          console.error('No map data found for the destination address:', destination);
        }
      }
    },
    async submitBooking() {
      try {
        const response = await axios.post('https://localhost:7200/api/Bookings', this.bookingDetails);
        console.log(response.data);
        this.showBookingDetails = true;
      } catch (error) {
        console.error(error);
        if (error.response) {
          this.errorMessage = error.response.data.message;
        } else if (error.request) {
          this.errorMessage = 'Server did not respond';
        } else {
          this.errorMessage = 'Error occurred while sending the request';
        }
      }
    },
    closePopup() {
      this.showBookingDetails = false;
    },
    async fetchDrivers() {
      try {
        const response = await axios.get('https://localhost:7200/api/Drivers/availablel-drivers');
        this.drivers = response.data;
        this.showAvailableDrivers = true;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchBookings() {
      try {
        const response = await axios.get('https://localhost:7200/api/Bookings/available-bookings');
        this.Bookings = response.data;
        this.showAvailableBookings = true;
      } catch (error) {
        console.error(error);
      }
    },
    toggleDriverDetails(driverId) {
      this.expandedDriverId = this.expandedDriverId === driverId ? null : driverId;
    },
    toggleAvailableBookings(bookingId) {
      this.expandedBookingId = this.expandedBookingId === bookingId ? null : bookingId;
    },
    deleteDriver(driverId) {
      if (confirm('Are you sure you want to delete this driver?')) {
        axios.delete(`https://localhost:7200/api/Drivers/${driverId}`)
          .then(() => {
            this.drivers = this.drivers.filter(driver => driver.driverId !== driverId);
            alert('Driver deleted successfully!');
          })
          .catch(error => {
            console.error(error);
            alert('Failed to delete driver. Please try again later.');
          });
      }
    },
    deleteBooking(bookingId) {
      if (confirm('Are you sure you want to delete this Booking?')) {
        axios.delete(`https://localhost:7200/api/Bookings/${bookingId}`)
          .then(() => {
            this.bookings = this.bookings.filter(Booking => Booking.bookingId !== bookingId);
            alert('Booking deleted successfully!');
          })
          .catch(error => {
            console.error(error);
            alert('Failed to delete Booking. Please try again later.');
          });
      }
    },
    updateOrigin(origin) {
      const parts = origin.split(',');
      this.bookingDetails.origin = parts.slice(0, 3).concat(parts.slice(-3)).join(', ');
    },

    // Event handler for updating destination coordinates
    updateDestination(destination) {
      const parts = destination.split(',');
    this.bookingDetails.destination = parts.slice(0, 3).concat(parts.slice(-3)).join(', ');
    this.handlePriceUpdate();
    },
    handlePriceUpdate(price) {
      this.bookingDetails.price = parseFloat(price).toFixed(2);
    },
    getCardClass(driverId) {
      const colors = ['red', 'blue', 'green', 'orange', 'purple'];
      return colors[driverId % colors.length];
    },

  },
};
</script>

<style scoped>
/* Component styles */

.dashboard {
  display: flex;
}

.left-side {
  flex: 1;
  padding: 20px;
  margin-top: 5%;
}

.right-side {
  flex: 1;
  padding: 20px;
}


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

.Booking-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  margin-top: 3%;
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
  position: absolute; /* Ensures the popup is positioned relative to its nearest positioned ancestor */
  right: 15%; /* Aligns the popup to the left side */
  top: 20%; /* Adjust the top value as needed to position it vertically */
  width: 300px; /* Adjust the width as needed */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
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
  background-color: hsla(160, 100%, 37%, 1);
  color: #fff;
  cursor: pointer;
}

.Booking-form button:hover {
  background-color: hsl(160deg 70.26% 38.39%);
}

.Booking-BT, .Drivers-BT {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: hsla(160, 100%, 37%, 1);
  color: #fff;
  cursor: pointer;
  margin-top: 10px;
}

.driver-card, .booking-card  {
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 8px;
  color: white;
  transition: transform 0.3s ease;
}

.driver-card.red, .booking-card.red {
  background-color: #e57373;
}

.driver-card.blue, .booking-card.blue {
  background-color: #64b5f6;
}

.driver-card.green, .booking-card.green {
  background-color: #81c784;
}

.driver-card.orange, .booking-card.orange {
  background-color: #ffb74d;
}

.driver-card.purple, .booking-card.purple {
  background-color: #9575cd;
}

.driver-card:hover, .booking-card:hover {
  transform: scale(1.05);
}

.driver-name {
  cursor: pointer;
  font-weight: bold;
  color: black;
}

.booking-name{
  cursor: pointer;
  font-weight: bold;
  color: white;
}

.booking-details {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
  color: black;
  width: fit-content;
}

.driver-details{
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
  color: black;
  width: fit-content;
  background-color: white;
}

.driver-details p {
  margin: 5px 0;
}

.driver-details button {
  margin-top: 10px;
}

.Drivers-BT {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: hsla(160, 100%, 37%, 1);
  color: #fff;
  cursor: pointer;
  margin-top: auto;
  margin-left: 1%;
}

.Driver-f, .drivers-container, .bookings-container{
  margin-top: 2%;
}

.fas,
.fa-solid {
  position: sticky;
  font-weight: 900;
  left: 90%;
  transform: translateY(-50%);
  cursor: pointer;
  color: red;
  font-size: 16px;
}
</style>
