import {createRouter, createWebHistory} from 'vue-router'
import Carteira from "@/components/Carteira.vue";
import Mercado from "@/components/Mercado.vue";
import Conta from "@/components/Conta.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Carteira,
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
      component: Conta
    }
  ],
})

export default router
