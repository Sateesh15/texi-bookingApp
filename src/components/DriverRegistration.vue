<template>
    <div>
        <Navbar />
      <form @submit.prevent="registerUser" class="registration-form">
        <h2>Driver Registration</h2>
        <input type="text" v-model="RegisterDetails.name" placeholder="Name" required>
        <input type="mobile" v-model="RegisterDetails.mobile" placeholder="Mobile" required>
        <input type="password" v-model="RegisterDetails.password" placeholder="Password" required>
        <input type="licenseNumber" v-model="RegisterDetails.licenseNumber" placeholder="License Number" required>
        <input type="datetime-local" v-model="RegisterDetails.licenseExpiration" placeholder="License Expiration" required>
        <div class="checkbox-container">
            <label for="isAvailable">IsAvailable</label>
            <input type="checkbox" v-model="RegisterDetails.isAvailable" id="isAvailable">         
        </div>
        <button type="submit">Register</button>
        <router-link to="/driver/login" class="register-link">Login</router-link>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Navbar from '../Navbar.vue';
  
  export default {
    components: {
    Navbar // Include the Navbar component
  },
    data() {
      return {
        RegisterDetails: {
            name: '',
            mobile: '',
            password: '',
            licenseNumber: '',
            licenseExpiration: 0,
            isAvailable: false,
        },
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post('https://localhost:7200/api/Drivers/register', this.RegisterDetails);
          console.log(response.data);
          this.$router.push('/driver/login'); // Redirect to the login page

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
    }
  }
  </script>
  
  <style scoped>
  .registration-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin-top: 10%;
  }
  h2 {
    text-align: center;
  }
  .registration-form input {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .registration-form button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: hsla(160, 100%, 37%, 1);
    color: #fff;
    cursor: pointer;
  }
  
  .registration-form button:hover {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: hsl(160deg 70.26% 38.39%);
    color: #fff;
    cursor: pointer;
  }

  .register-link {
    display: block;
    margin-top: 10px;
    text-align: center; /* Center the register link */
    color: hsla(160, 100%, 37%, 1);
    text-decoration: none;
  }
  
  .register-link:hover {
    color: #6a727a;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    width: 50%;
  }
  
  </style>
  