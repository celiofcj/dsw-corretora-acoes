<script setup lang="ts">
import {RouterView} from 'vue-router'
import Nav from "@/components/Nav.vue";
import GerenciadorHora from "@/components/GerenciadorHora.vue";
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <Nav></Nav>
    </div>

    <div class="container">
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
  margin:0;
  width: 100%;
}

</style>
