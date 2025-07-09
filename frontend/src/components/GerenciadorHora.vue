<script setup lang="ts">
import {computed, onBeforeMount, onMounted, ref} from "vue";
  import emitter from "@/processing/eventBus.ts";

  const hora = ref<number>(0)
  const minuto = ref<number>(0)
  const token = localStorage.getItem('authToken');

  const url = 'http://localhost:3000/negociacao'

  async function registrarHorarioAtual(hora: number, minuto: number) {
    await fetch(url + '/atualizarHoraNegociacao', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        horaNegociacao: formatarHorario(hora, minuto)
      })
    }).catch(error => {
        console.error(error)
      })
  }

  async function obterHorarioAtual() {

    await fetch(url + '/horaNegociacao', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then(response => {
        if (!response.ok && response.status !== 404) {
          throw new Error('Erro ao consultar horário')
        }

        if(response.status == 404) {
          hora.value = 12
          minuto.value = 0

          return null
        }

        return response.json()
      }).then(json => {
        if(json === null) {
          return
        }

        const horaNegociacao = json.horaNegociacao
        console.log(`hora: ${horaNegociacao.substring(0, 2)}`)
        console.log(`${horaNegociacao.substring(3, 5)}`)
        hora.value = parseInt(horaNegociacao.substring(0, 2))
        minuto.value = parseInt(horaNegociacao.substring(3, 5))
      }).catch(error => {
          console.error(error)
        })
  }
  function avancarMinutos(minutos: number) {
    console.log('Enviando notificação')
    const totalMinutos = hora.value * 60 + minuto.value + minutos

    const horaCalculada = Math.floor((totalMinutos % 1440) / 60)
    const minutoCalculado = totalMinutos % 60

    emitter.emit('time-process:start', { hora: horaCalculada, minuto: minutoCalculado, minutoAnterior: minuto.value })

    registrarHorarioAtual(horaCalculada, minutoCalculado)
    hora.value = horaCalculada
    minuto.value = minutoCalculado
  }

  function formatarHorario(hora: number, minuto: number) {
    const h = hora.toString().padStart(2, '0')
    const m = minuto.toString().padStart(2, '0')
    return `${h}:${m}`
  }

  const horaFormatada = computed(() => {
    return formatarHorario(hora.value, minuto.value);
  })

  onMounted(async ()=> {
    await obterHorarioAtual()
    emitter.emit('time-process:start', { hora: hora.value, minuto: minuto.value, minutoAnterior: minuto.value })
    emitter.on('time-now:request', ()=> {
      emitter.emit('time-now:response', {hora: hora.value, minuto: minuto.value})
    })
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