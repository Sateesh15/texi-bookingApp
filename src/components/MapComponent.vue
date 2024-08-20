<template>
    <l-map
      style="height: 500px; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:bounds="onBoundsUpdate"
      @click="setDestination"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-marker
        :lat-lng="center"
      >
        <l-popup>Your Location</l-popup>
      </l-marker>
      <l-marker
        v-if="destination"
        :lat-lng="destination"
      >
        <l-popup>{{ destinationAddress }}</l-popup>
      </l-marker>
    </l-map>
  </template>
  
  <script>
  import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
  import "leaflet/dist/leaflet.css";
  import axios from 'axios';

 
  
  export default {
    name: "MapComponent",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
    },
    data() {
      return {
        zoom: 12,
        center: [17.3850, 78.4867],
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        destination: null,
        originAddress: null,
        destinationAddress: null, // Add destinationAddress variable
        bookingDetails: {
        price: null ,// Initialize price here
        vehicleType: "bike", // Default vehicle type
      },
      };
    },
    methods: {
      onBoundsUpdate() {
        // Implement logic for when bounds update if needed
      },
      async setDestination(event) {
        this.destination = [event.latlng.lat, event.latlng.lng];
        await this.updateDestinationAddress(); // Update destination address
        this.$emit('update-destination', this.destinationAddress); // Emit event with destination location address
        this.calculatePriceFromCoordinates(this.destination); // Calculate price based on coordinates
        
      },
      async updateDestinationAddress() {
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.destination[0]}&lon=${this.destination[1]}`);
          this.destinationAddress = response.data.display_name;
        } catch (error) {
          console.error("Error fetching destination address:", error);
        }
      },
      // Calculate distance between two coordinates using Haversine formula
    calculateDistance(coord1, coord2) {
      const [lat1, lon1] = coord1;
      const [lat2, lon2] = coord2;

      const R = 6371; // Radius of the Earth in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    },
    // Convert degrees to radians
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    // Calculate price based on distance
    /*calculatePriceFromCoordinates(destination) {
      if (this.originAddress && destination) {
        const originCoords = this.center; // Assuming center as origin
        const distance = this.calculateDistance(originCoords, destination);
        const price = distance * 10; // Assuming 10 currency units per km
        this.$emit('update-price', price);
        this.bookingDetails.price = price;
        console.log("Price:", price);
        console.log("price 2:",this.bookingDetails.price)
      }
    },*/

    calculatePriceFromCoordinates(destination) {
  if (this.originAddress && destination) {
    const originCoords = this.center; // Assuming center as origin
    const distance = this.calculateDistance(originCoords, destination);
    let basePrice = distance * 10; // Assuming 10 currency units per km

    // Adjust price based on vehicle type
    if (this.bookingDetails.vehicleType === "auto") {
      basePrice += 10; // Adding an additional cost for auto
    } else if (this.bookingDetails.vehicleType === "cab") {
      basePrice += 20; // Adding an additional cost for cab
    }

    this.bookingDetails.price = basePrice.toFixed(2); // Ensure price is a string with two decimal places
    console.log("Price:", this.bookingDetails.price);
    this.$emit('price-updated', this.bookingDetails.price);
  }
},

      setUserLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              this.center = [position.coords.latitude, position.coords.longitude];
              this.zoom = 14;
              await this.updateOriginAddress(); // Update origin address
              this.$emit('update-origin', this.originAddress); 
            },
            (error) => {
              console.error("Error getting location:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      },
      async updateOriginAddress() {
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.center[0]}&lon=${this.center[1]}`);
          this.originAddress = response.data.display_name;
        } catch (error) {
          console.error("Error fetching origin address:", error);
        }
      },
    },
    mounted() {
      this.setUserLocation();
    },
  };
  </script>
  
  <style>
  /* Add any specific styling you need for the map */
  </style>
  