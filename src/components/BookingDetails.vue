<template>
    <div>
      <h2>Booking Details</h2>
      <div v-if="booking">
        <p>Booking ID: {{ booking.bookingId }}</p>
        <p>User ID: {{ booking.userId }}</p>
        <p>Driver ID: {{ booking.driverId }}</p>
        <p>Origin: {{ booking.origin }}</p>
        <p>Destination: {{ booking.destination }}</p>
        <p>Pickup Time: {{ booking.pickupTime }}</p>
        <p>Accepted Time: {{ booking.acceptedTime }}</p>
        <p>Price: {{ booking.price }}</p>
        <p>Confirmed: {{ booking.isConfirmed }}</p>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        booking: null
      };
    },
    async created() {
      // Retrieve booking details when component is created
      await this.getBookingDetails();
    },
    methods: {
      async getBookingDetails() {
        try {
          const response = await axios.get(`https://localhost:7200/api/Bookings/${this.$route.params.id}`);
          this.booking = response.data;
        } catch (error) {
          console.error(error);
          // Handle error while fetching booking details
        }
      }
    }
  }
  </script>
  
  <style scoped>
  /* Component styles */
  </style>
  