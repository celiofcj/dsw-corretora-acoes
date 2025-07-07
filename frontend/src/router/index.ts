import {createRouter, createWebHistory} from 'vue-router'
import Carteira from "@/components/Carteira.vue";
import Mercado from "@/components/Mercado.vue";
import ContaCorrente from "@/components/ContaCorrente.vue";
import Login from "@/components/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/carteira',
      name: 'carteira',
      component: Carteira
    },
    {
      path: '/mercado',
      name: 'mercado',
      component: Mercado
    },
    {
      path: '/conta',
      name: 'conta',
      component: ContaCorrente
    }
  ],
})

export default router
