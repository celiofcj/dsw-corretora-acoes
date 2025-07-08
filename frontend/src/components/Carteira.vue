<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import emitter, { type HoraOperacao } from "@/processing/eventBus.ts"

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
const tickersAtualizados = ref(new Set<string>())

let hora = 12
let minuto = 0

const fetchCarteiras = async () => {
  try {
    const token = localStorage.getItem('authToken')
    const carteiraRes = await fetch('http://localhost:3000/carteira', {
      headers: { 'Authorization': `Bearer ${token}` }
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

const calcularRendimentoPercentual = (acao: Acao): number => {
  const atual = obterPrecoAtual(acao.ticker)
  return ((atual - acao.precoCompra) / acao.precoCompra) * 100
}

// Venda a mercado
const acaoSelecionada = ref<Acao | null>(null)
const quantidadeVenda = ref(1)

const abrirModalVenda = (acao: Acao) => {
  acaoSelecionada.value = acao
  quantidadeVenda.value = 1
}

const fecharModalVenda = () => {
  acaoSelecionada.value = null
}

const confirmarVenda = async () => {
  if (!acaoSelecionada.value) return

  const precoAtual = obterPrecoAtual(acaoSelecionada.value.ticker)

  const venda = {
    dataHora: new Date().toISOString(),
    ticker: acaoSelecionada.value.ticker,
    quantidade: quantidadeVenda.value,
    executada: true,
    preco: precoAtual
  }

  try {
    const token = localStorage.getItem('authToken')
    const res = await fetch('http://localhost:3000/ordemVenda', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(venda)
    })

    if (!res.ok) throw new Error('Erro ao registrar venda')
    alert('Venda registrada com sucesso!')
    fecharModalVenda()
    fetchCarteiras()
  } catch (e) {
    console.error(e)
    alert('Erro ao registrar venda')
  }
}

const onProcessComplete = (horaOperacao: HoraOperacao) => {
  console.log(`[Listener Carteira] Evento 'process:complete' recebido!`)
  hora = horaOperacao.hora
  minuto = horaOperacao.minuto
  fetchCarteiras()
}

onMounted(() => {
  fetchCarteiras()
  emitter.on('time-process:complete', onProcessComplete)
})

onUnmounted(() => {
  emitter.off('time-process:complete', onProcessComplete)
})
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
        <th>Rendimento (R$)</th>
        <th>Rendimento %</th>
        <th>Negociar</th>
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
        <td>
          <button class="botao-remover" @click="abrirModalVenda(acao)">Vender</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal de venda -->
    <div v-if="acaoSelecionada" class="modal">
      <div class="modal-conteudo">
        <h3>Venda de {{ acaoSelecionada.ticker }}</h3>

        <label>
          Quantidade a vender:
          <input type="number" v-model.number="quantidadeVenda" :max="acaoSelecionada.quantidade" min="1" />
        </label>

        <div class="modal-botoes">
          <button @click="confirmarVenda">Confirmar</button>
          <button @click="fecharModalVenda">Cancelar</button>
        </div>
      </div>
    </div>
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

.botao-remover {
  all: unset;
  cursor: pointer;
  background-color: #a72a2a;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  transition: background-color 0.2s;
}

.botao-remover:hover {
  background-color: #c43a3a;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-conteudo {
  background: white;
  padding: 2em;
  border-radius: 8px;
  width: 300px;
}

.modal-conteudo label {
  display: block;
  margin-bottom: 1em;
}

.modal-botoes {
  display: flex;
  justify-content: space-between;
}
</style>