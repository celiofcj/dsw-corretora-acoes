<script setup lang="ts">
  import { computed, ref } from "vue";
  import emitter from "@/processing/eventBus.ts";

  const hora = ref(12)
  const minuto = ref(0)

  let contadorMinutos = 0

  function avancarMinutos(minutos: number) {
    console.log('Enviando notificação')
    contadorMinutos += minutos
    const totalMinutos = hora.value * 60 + minuto.value + minutos

    const horaCalculada = Math.floor((totalMinutos % 1440) / 60)
    const minutoCalculado = totalMinutos % 60

    emitter.emit('time-process:start', { hora: horaCalculada, minuto: minutoCalculado, contadorMinutos })

    hora.value = horaCalculada
    minuto.value = minutoCalculado
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
  background-color: hsla(160, 100%, 37%, 1);
  border: hsla(160, 100%, 37%, 1);
}
</style>