import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserRegistration from '../components/UserRegistration.vue';
import UserLogin from '../components/UserLogin.vue';
import BookingForm from '../components/BookingForm.vue';
import DriverRegistration from '../components/DriverRegistration.vue';
import DriverLogin from '../components/DriverLogin.vue';
import BookingDetails from '../components/BookingDetails.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',name: 'login', component: UserLogin},
    {
      path: '/home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    { path: '/user/register', component: UserRegistration },
  { path: '/booking', component: BookingForm },
  { path: '/driver/register', component: DriverRegistration },
  { path: '/driver/login', component: DriverLogin },
  { path: '/booking/details', component: BookingDetails },
  ]
})


router.beforeEach((to, from, next) => {
  document.body.style.backgroundColor = '#ffffff'; // Set background color to white
  next(); // Proceed with navigation
});



export default router
