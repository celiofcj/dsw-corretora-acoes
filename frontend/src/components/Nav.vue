<script setup lang="ts">

import {RouterLink} from "vue-router";
</script>

<template>
    <nav>
      <router-link class="item" to="/carteira">Carteira</router-link>
      <router-link class="item" to="/mercado">Mercado</router-link>
      <router-link class="item" to="/conta">Conta</router-link>
      <router-link class="item menor" to="/configuracoes-conta">
        <img class="account-icon" src="@/assets/account-icon.png">
      </router-link>
    </nav>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  transition: 0.4s;
  padding: 3px;
}

.item {
  text-align: center;
  color: hsla(160, 100%, 37%, 1);
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: block;
  padding: 0.5em;
  transition: background-color 0.3s;
}

.item:hover {
  background-color: lightgray;
}

nav .item:first-child {
  border-bottom-left-radius: 0.5em;
  border-top-left-radius: 0.5em;
}

nav .item:last-child {
  border-bottom-right-radius: 0.5em;
  border-top-right-radius: 0.5em;
}

.menor {
  height: 1.6em;
  width: 6em;
}

.account-icon {
  width: 100%;
  height: 100%;
}

</style>