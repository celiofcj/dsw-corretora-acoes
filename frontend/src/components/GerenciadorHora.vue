<script setup lang="ts">
import {computed, ref} from "vue";
  const hora = ref(0)
  const minuto = ref(0)


  function avancarMinutos(minutos: number) {
    const totalMinutos = hora.value * 60 + minuto.value + minutos

    hora.value = Math.floor((totalMinutos % 1440) / 60) // 1440 = 24 * 60
    minuto.value = totalMinutos % 60
  }

  const horaFormatada = computed(() => {
    const h = hora.value.toString().padStart(2, '0')
    const m = minuto.value.toString().padStart(2, '0')
    return `${h}:${m}`
  })
</script>

<template>
  <div class="wrapper">
    <span class="hora">{{horaFormatada}}</span>
    <div class="botoes">
      <button class="botao-tempo" @click="avancarMinutos(1)">+1 min</button>
      <button class="botao-tempo" @click="avancarMinutos(5)">+5 min</button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding-bottom: 0.9em;
}

.hora {
  margin-left: auto;
  margin-right: auto;
  font-size: 30px;
}

.botoes {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.botao-tempo {
  all: unset;
  cursor: pointer;
  background: rgb(27,30,47);
  color: white;
  border: 1px rgb(27,30,47);
  border-radius: 0.5em;
  padding: 2px 5px;
  transition: background-color 0.2s;
}

.botao-tempo:hover {
  background-color: darkslategrey;
  border: darkslategrey;
}
</style>