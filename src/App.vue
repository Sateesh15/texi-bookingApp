<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

</script>

<template>
  <header>

    <div class="wrapper">
      

      <nav>
        <RouterLink to="/home"></RouterLink>
        <RouterLink to="/user/register"></RouterLink>
        <RouterLink to="/"></RouterLink>
        <RouterLink to="/booking"></RouterLink>
        <RouterLink to="/driver/register"></RouterLink>
        <RouterLink to="/driver/login"></RouterLink>
        <RouterLink to="/bookings"></RouterLink>
        <RouterLink to="/booking/details"></RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
