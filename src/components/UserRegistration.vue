<template>
    <div>
        <navbar></navbar>
      <form @submit.prevent="registerUser" class="registration-form">
        <h2>User Registration</h2>
        <input type="text" v-model="name" placeholder="Name" required maxlength="25">
        <input type="email" v-model="email" placeholder="Email" required>
        <input type="password" v-model="password" placeholder="Password" required>
        <input type="text" v-model="phoneNumber" placeholder="Phone Number" v-mask="phoneMask" required maxlength="16">
        <button type="submit">Register</button>
        <router-link to="/" class="register-link">Login</router-link>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Navbar from '../Navbar.vue';
  import MASK_CONSTANTS from "../constants/mask-constants";
  
  export default {
    components: {
    Navbar // Include the Navbar component
  },
    data() {
      return {
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        phoneMask: MASK_CONSTANTS.PHONE.DEFAULT
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post('https://localhost:7200/api/Users/register', {
            name: this.name,
            email: this.email,
            password: this.password,
            phoneNumber: this.phoneNumber
          });
          console.log(response.data);
          // Handle successful registration
        this.$router.push('/'); // Redirect to the login page
        } catch (error) {
          console.error(error);
          // Handle registration error
        }
      }
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
  </style>
  