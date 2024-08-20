<template >
  <div class="page-container">
  <navbar></navbar>
    <div class="about">
      <div class="login-container">
      <form @submit.prevent="loginUser" class="login-form">
        <h2>User Login</h2>
        <input type="email" v-model="email" placeholder="Email" required>
        <input type="password" v-model="password" placeholder="Password" required>
        <button type="submit">Login</button>
        <div  v-if="showErrorMessage" class="error-message">
            Invalid email or password. Please try again.
        </div>
        <router-link to="/user/register" class="register-link">Register</router-link>
      </form>
    </div>
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
        userId:'',
        name:'',
        email: '',
        password: '',
        showErrorMessage: false
      };
    },
    methods: {
      async loginUser() {
        try {
          const response = await axios.post(`https://localhost:7200/api/Users/login?email=${this.email}&password=${this.password}`);
          console.log(response.data);
          console.log("login success", response.data);
          // Set isLoggedIn flag in local storage
          localStorage.setItem('isLoggedIn', true);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('userId', response.data.userId);
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
  
  <style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url()
}

.page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
  .about {
  flex: 1; /* Make the about section take up remaining space */
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15%;
  }
  .login-container {
    display: flex;
  justify-content: center;
  align-items: center;
  }
  .login-form {
    max-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent background */
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
  