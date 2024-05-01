<template>
    <!-- Navbar component -->
    <nav class="navbar">
        <img src="../src/@/assets/logo.png" alt="Your Logo" class="logo">
      <ul class="nav-links">
        <!-- Show Logoff link only if user is logged in -->
        <li v-if="isLoggedIn"><router-link to="/" @click="logout">Logoff</router-link></li>
        <!-- Show "Driver Login" link if user is not logged in and not on the driver login page -->
        <li v-if="!isLoggedIn && $route.path !== '/driver/login'"><router-link to="/driver/login">Driver Login</router-link></li>
        <!-- Show "User Login" link if not on the login page -->
        <li v-if="!isLoggedIn && $route.path !== '/'"><router-link to="/">User Login</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoggedIn: false, // Initially assume user is not logged in
      };
    },
    computed: {
      // Access the current route using $route
      currentRoute() {
        return this.$route.path;
      }
    },
    mounted() {
      // Check if user is logged in (example: check local storage, cookie, etc.)
      // Set isLoggedIn to true if user is logged in
      const loggedIn = localStorage.getItem('isLoggedIn'); // Example: Check if a flag in local storage indicates the user is logged in
      this.isLoggedIn = loggedIn === 'true'; // Convert the value from local storage to a boolean
    },
    methods: {
      logout() {
        // Perform logout actions, such as clearing local storage or session
        localStorage.removeItem('isLoggedIn'); // Example: Remove the flag from local storage
        this.isLoggedIn = false; // Update isLoggedIn flag
      }
    }
  }
  </script>
  
  <style scoped>
  /* Styles for the navbar */
  .navbar {
    background-color: #33b0a5; /* Background color of the navbar */
    color: #fff; /* Text color */
    display: flex; /* Flexbox layout */
    justify-content: space-between; /* Space between logo and links */
    align-items: center; /* Center vertically */
    padding: 10px 20px; /* Padding */
  }
  
  .logo {
    font-size: 1.5rem; /* Font size of the logo */
  }
  
  .nav-links {
    list-style: none; /* Remove bullet points from the list */
    display: flex; /* Display links in a row */
  }
  
  .nav-links li {
    margin-right: 20px; /* Spacing between each link */
  }
  
  .nav-links li a {
    text-decoration: none; /* Remove underline from links */
    color: #fff; /* Text color of links */
  }
  
  .nav-links li a:hover {
    color: #ffd700; /* Change color on hover */
  }

  .logo {
    width: 60px; /* Adjust the width of the logo as needed */
    height: auto; /* Maintain aspect ratio */
    background: #fffffff7;
  }
  </style>
  