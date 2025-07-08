<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import Nav from "@/components/Nav.vue";
import GerenciadorHora from "@/components/GerenciadorHora.vue";

const router = useRoute();

const rotasSemHeader = ['/login', '/criar-conta', '/recuperar-senha']

const mostrarComponentes = computed(() => !rotasSemHeader.includes(router.path));

</script>

<template>
  <div class="wrapper">

    <div class="container" v-if="mostrarComponentes">
      <Nav></Nav>
    </div>

    <div class="container" v-if="mostrarComponentes">
      <GerenciadorHora></GerenciadorHora>
    </div>

    <div class="container">
      <RouterView />
    </div>

  </div>
</template>

<style scoped>
.wrapper {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  gap: 1em;
}

.container {
  background: whitesmoke;
  border-radius: 1em;
  margin: 0;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>