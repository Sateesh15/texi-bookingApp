<template >
    <div class="about">
        <Navbar />
      <form @submit.prevent="loginUser" class="login-form">
        <h2>Driver Login</h2>
        <input type="name" v-model="name" placeholder="Name" required>
        <input type="password" v-model="password" placeholder="Password" required>
        <button type="submit">Login</button>
        <router-link to="/driver/register" class="register-link">Register</router-link>
      </form>
      
  
      <div  v-if="showErrorMessage" class="error-message">
        Invalid email or password. Please try again.
      </div>
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
        name: '',
        password: '',
        showErrorMessage: false
      };
    },
    methods: {
      async loginUser() {
        try {
          const response = await axios.post(`https://localhost:7200/api/Drivers/login?name=${this.name}&password=${this.password}`);
          console.log(response.data);
          console.log("login success");
          localStorage.setItem('isLoggedIn', true);
          this.$router.push('/booking'); // Navigate to the booking form
        } catch (error) {
          console.error(error);
          console.log("not login");
          this.showErrorMessage = true;
          // Handle login error
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin-top: 10%;
  }

  h2{

    text-align: center;
  }
  
  .login-form input {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .login-form button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color:hsla(160, 100%, 37%, 1);
    color: #fff;
    cursor: pointer;
  }
  
  .login-form button:hover {
    background-color: hsl(160deg 70.26% 38.39%);
  }
  
  .error-message {
    margin-top: 10px;
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
    
  }

  .register-link {
    display: block;
    margin-top: 10px;
    text-align: center; /* Center the register link */
    color: hsla(160, 100%, 37%, 1);
    text-decoration: none;
  }
  
  .register-link:hover {
    color: hsl(160, 4%, 27%);
  }

  </style>
  