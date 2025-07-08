<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import emitter, {type HoraOperacao} from "@/processing/eventBus.ts";

interface Acao {
  _id: string
  ticker: string
  quantidade: number
  precoCompra: number
  quantidadeVendida?: number
  precoVenda?: number
}

interface PrecoAtual {
  ticker: string
  preco: number
}

const carteiras = ref<Acao[]>([])
const precosAtuais = ref<PrecoAtual[]>([])
const loading = ref(true)

let hora = 12
let minuto = 0

const fetchCarteiras = async () => {
  try {
    const token = localStorage.getItem('authToken')

    const carteiraRes = await fetch('http://localhost:3000/carteira', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!carteiraRes.ok) throw new Error('Erro ao buscar carteira')
    carteiras.value = await carteiraRes.json()

    const endpoint = `https://raw.githubusercontent.com/marciobarros/dsw-simulador-corretora/refs/heads/main/${minuto}.json`
    const precosRes = await fetch(endpoint)
    if (!precosRes.ok) throw new Error('Erro ao buscar preços atuais')
    precosAtuais.value = await precosRes.json()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const obterPrecoAtual = (ticker: string): number => {
  return precosAtuais.value.find(p => p.ticker === ticker)?.preco ?? 0
}

const calcularRendimento = (acao: Acao): number => {
  const precoAtual = obterPrecoAtual(acao.ticker)
  return (precoAtual - acao.precoCompra) * acao.quantidade
}

const tickersAtualizados = ref(new Set<string>())

const calcularRendimentoPercentual = (acao: Acao): number => {
  const atual = obterPrecoAtual(acao.ticker)
  return ((atual - acao.precoCompra) / acao.precoCompra) * 100
}

const onProcessComplete = (horaOperacao: HoraOperacao) => {
  console.log(`[Listener Carteira] Evento 'process:complete' recebido!`);
  console.log(horaOperacao);
  console.log(`[Listener Carteira] -------------------------------------`);
  hora = horaOperacao.hora
  minuto = horaOperacao.minuto
  fetchCarteiras();
};

onMounted(() => {
  fetchCarteiras()
  emitter.on('time-process:complete', onProcessComplete);
})

onUnmounted(() => {
  console.log('On unmount');
  emitter.off('time-process:complete', onProcessComplete);
});

</script>

<template>
  <div class="container-mercado">
    <div class="acoes-header">
      <h2>Minha Carteira</h2>
    </div>

    <table class="tabela-acoes">
      <thead>
      <tr>
        <th>Ticker</th>
        <th>Qtd</th>
        <th>Compra (R$)</th>
        <th>Atual (R$)</th>
        <th>Rendimento $</th>
        <th>Rendimento %</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="acao in carteiras"
          :key="acao._id"
          :class="{ blink: tickersAtualizados.has(acao.ticker) }"
      >
        <td>{{ acao.ticker }}</td>
        <td>{{ acao.quantidade }}</td>
        <td>{{ acao.precoCompra.toFixed(2) }}</td>
        <td>{{ obterPrecoAtual(acao.ticker).toFixed(2) }}</td>
        <td
            :class="{
              positivo: calcularRendimento(acao) > 0,
              negativo: calcularRendimento(acao) < 0
            }"
        >
          {{ calcularRendimento(acao).toFixed(2) }}
        </td>
        <td
            :class="{
              positivo: calcularRendimento(acao) > 0,
              negativo: calcularRendimento(acao) < 0
            }"
        >
          {{ calcularRendimentoPercentual(acao).toFixed(2) }}%
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container-mercado {
  padding: 16px;
}

.tabela-acoes {
  width: 100%;
  border-collapse: collapse;
}

.tabela-acoes th,
.tabela-acoes td {
  padding: 8px 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.positivo {
  color: green;
}

.negativo {
  color: red;
}

.blink {
  animation: piscar 0.6s ease-in-out;
}

@keyframes piscar {
  0% { background-color: #e0ffe0; }
  100% { background-color: transparent; }
}
</style>