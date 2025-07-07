<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import Nav from "@/components/Nav.vue";
import GerenciadorHora from "@/components/GerenciadorHora.vue";
import {onMounted, ref} from "vue";

const router = useRouter();
const usuarioLogado = ref(false);

async function validarAcesso() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    usuarioLogado.value = false;
  }

  try {
    const response = await fetch('http://localhost:3000/carteira', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      usuarioLogado.value = true;
    } else {
      usuarioLogado.value = false;
      localStorage.removeItem('authToken');
    }
  } catch (error) {
    usuarioLogado.value = false;
  }
}

onMounted(async () => {
  await validarAcesso();

  if(!usuarioLogado.value) {
    router.push('/login')
  }
});

</script>

<template>
  <div class="wrapper" >
      <div class="container" v-if="usuarioLogado">
        <Nav></Nav>
      </div>

      <div class="container" v-if="usuarioLogado">
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

</style>
