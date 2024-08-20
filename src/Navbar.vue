<template>
    <!-- Navbar component -->
    <nav class="navbar">
        <!-- <img src="../src/@/assets/logo.png" alt="Your Logo" class="logo"> -->
        <div class="user-info" v-if="isLoggedIn">
          <i class="fas fa-user-circle user-icon" @click="toggleUserDetails"></i> <!-- FontAwesome User Icon -->
          <span class="username">{{ name }}</span>
        </div>
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
    <!-- User Details Form -->
  <div :class="['sliding-panel', { 'show': showUserDetails }]">
    <form @submit.prevent="updateUserDetails">
      <h2>User Details</h2>
      <label for="name">Name:</label>
      <input type="text" v-model="userDetails.name" id="name" required>
      <label for="email">Email:</label>
      <input type="email" v-model="userDetails.email" id="email" required>
      <label for="password">Password:</label>
      <input type="password" v-model="userDetails.password" id="password" required>
      <label for="phoneNumber">Phone Number:</label>
      <input type="text" v-model="userDetails.phoneNumber" id="phoneNumber" required>
      <button type="submit" @click="toggleUserDetails">Update</button>
      <button type="button" @click="toggleUserDetails">Close</button>
    </form>
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        isLoggedIn: false, // Initially assume user is not logged in
        name: localStorage.getItem('name') || '',
        showUserDetails: false,
        userDetails: {
        userId: localStorage.getItem('userId') || '',
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
      }
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
      toggleUserDetails() {
      this.showUserDetails = !this.showUserDetails;
      // Fetch user details when the form is shown
      if (this.showUserDetails) {
        this.fetchUserDetails();
      }
    },
    async fetchUserDetails() {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`https://localhost:7200/api/Users/${userId}`);
        this.userDetails = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async updateUserDetails() {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.put(`https://localhost:7200/api/Users/${userId}`, this.userDetails);
        console.log(response.data);
        // Optionally, display a success message or perform other actions
      } catch (error) {
        console.error(error);
        // Optionally, display an error message or perform other actions
      }
    },
      logout() {
        // Perform logout actions, such as clearing local storage or session
        localStorage.removeItem('name');
        localStorage.removeItem('isLoggedIn'); // Example: Remove the flag from local storage
        localStorage.removeItem('id');
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

  .user-info {
    display: flex; /* Flex layout for icon and username */
    align-items: center; /* Vertically align icon and text */
    margin-right: 20px; /* Space before navigation links */
  }
  
  .user-icon {
    color: #fffffff7;/* Icon color */
    margin-right: 5px; /* Space between icon and username */
  }
  
  .username {
    color: #fffffff7; /* Color of username, adjust as needed */
    font-weight: bold; /* Make the username bold */
  }

  /* Styles for the sliding panel */
.sliding-panel {
  position: fixed;
  top: 0;
  right: -300px; /* Hide the panel initially */
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  overflow-y: auto;
  padding: 20px;
  z-index: 1000;
  padding-right: 0%;
}

.sliding-panel.show {
  right: 0; /* Show the panel */
}

.sliding-panel h2 {
  margin-top: 0;
}

.sliding-panel label {
  display: block;
  margin-bottom: 5px;
}

.sliding-panel input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.sliding-panel button {
  padding: 10px 20px;
  background-color: #33b0a5;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 10px;
}

.sliding-panel button:last-child {
  background-color: #ccc;
}
  
  </style>
  