import {createRouter, createWebHistory} from 'vue-router'
import Carteira from "@/components/Carteira.vue";
import Mercado from "@/components/Mercado.vue";
import ContaCorrente from "@/components/movimentacao/ContaCorrente.vue";
import Login from "@/components/Login.vue";
import CriarConta from "@/components/CriarConta.vue";
import RecuperarSenha from "@/components/RecuperarSenha.vue";
import ConfiguracoesConta from "@/components/ConfiguracoesConta.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/criar-conta',
      name: 'criar-conta',
      component: CriarConta,
    },
    {
      path: '/recuperar-senha',
      name: 'recuperar-senha',
      component: RecuperarSenha
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
    },
    {
      path: '/configuracoes-conta',
      name: 'configuracoes-conta',
      component: ConfiguracoesConta
    }
  ],
})

export default router
