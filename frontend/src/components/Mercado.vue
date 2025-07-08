<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import ModalAdicionarAcao from './ModalAdicionarAcao.vue';
import emitter, {type HoraOperacao} from "@/processing/eventBus.ts"; // Importe o novo componente

// --- DEFINIÇÃO DE TIPOS ---
interface Acao {
  ticker: string;
  fechamento: number;
  preco?: number;
}

// --- ESTADO REATIVO (REFS) ---
let hora = 12;
let minuto = 0;
const acoesVisiveis = ref<Acao[]>([]);
let todasAsAcoes: Acao[] = [];
const tickersAtualizados = ref(new Set<string>());
const mostrarModal = ref(false);

// --- PERSISTÊNCIA (localStorage) ---

// Salva a lista de tickers visíveis no localStorage sempre que ela mudar
watch(acoesVisiveis, (newAcoes) => {
  const tickers = newAcoes.map(a => a.ticker);
  localStorage.setItem('acoesVisiveis', JSON.stringify(tickers));
}, { deep: true });

// --- LÓGICA DE DADOS (API) ---
const TICKERS_URL = 'https://raw.githubusercontent.com/marciobarros/dsw-simulador-corretora/refs/heads/main/tickers.json';
const PRECO_URL_BASE = 'https://raw.githubusercontent.com/marciobarros/dsw-simulador-corretora/refs/heads/main/';

async function fetchPrecosAtuais() {
  try {
    const response = await fetch(`${PRECO_URL_BASE}${minuto}.json`);
    const precosAtuais: { ticker: string, preco: number }[] = await response.json();
    tickersAtualizados.value.clear();
    const mapaPrecos = new Map(precosAtuais.map(p => [p.ticker, p.preco]));
    acoesVisiveis.value.forEach(acao => {
      const novoPreco = mapaPrecos.get(acao.ticker);
      if (novoPreco && acao.preco !== novoPreco) {
        acao.preco = novoPreco;
        tickersAtualizados.value.add(acao.ticker);
      }
    });
    setTimeout(() => tickersAtualizados.value.clear(), 1000);
  } catch (error) {
    console.error('Erro ao buscar preços atuais:', error);
  }
}

// --- LÓGICA DE MANIPULAÇÃO DA TABELA ---

const acoesDisponiveis = computed(() => {
  const tickersVisiveis = new Set(acoesVisiveis.value.map(a => a.ticker));
  return todasAsAcoes.filter(a => !tickersVisiveis.has(a.ticker));
});

function adicionarAcao(ticker: string) {
  const acaoParaAdicionar = todasAsAcoes.find(a => a.ticker === ticker);
  if (acaoParaAdicionar) {
    acoesVisiveis.value.push(JSON.parse(JSON.stringify(acaoParaAdicionar)));
    fetchPrecosAtuais();
  }
}

function removerAcao(tickerParaRemover: string) {
  acoesVisiveis.value = acoesVisiveis.value.filter(
      (acao) => acao.ticker !== tickerParaRemover
  );
}

const onProcessComplete = (horaOperacao: HoraOperacao) => {
  console.log(`[Listener Mercado] Evento 'process:complete' recebido!`);
  console.log(horaOperacao);
  console.log(`[Listener Mercado] -------------------------------------`);
  hora = horaOperacao.hora
  minuto = horaOperacao.minuto
  fetchPrecosAtuais()
};

// --- CICLO DE VIDA DO COMPONENTE ---
onMounted(async () => {
  try {
    emitter.on('time-process:complete', onProcessComplete);

    const response = await fetch(TICKERS_URL);
    todasAsAcoes = await response.json();

    const tickersSalvos = localStorage.getItem('acoesVisiveis');
    if (tickersSalvos) {
      const tickers: string[] = JSON.parse(tickersSalvos);
      acoesVisiveis.value = tickers.map(ticker => todasAsAcoes.find(a => a.ticker === ticker)).filter(Boolean) as Acao[];
    } else {
      // Se não houver lista salva (primeira visita), escolhe 10 aleatoriamente [cite: 20]
      acoesVisiveis.value = [...todasAsAcoes].sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    // Busca os preços para o horário inicial (14:00)
    await fetchPrecosAtuais();
  } catch (error) {
    console.error("Erro ao inicializar o componente:", error);
  }
});

onUnmounted(() => {
  console.log('On unmount');
  emitter.off('time-process:complete', onProcessComplete);
});

</script>

<template>
  <ModalAdicionarAcao
      v-if="mostrarModal"
      :acoes="acoesDisponiveis"
      @fechar="mostrarModal = false"
      @adicionar="adicionarAcao"
  />

  <div class="container-mercado">
    <div class="acoes-header">
      <h2>Ações no Mercado</h2>
      <button @click="mostrarModal = true" class="botao-adicionar">Adicionar Ação</button>
    </div>

    <table class="tabela-acoes">
      <thead>
      <tr>
        <th>Ticker</th>
        <th>Preço</th>
        <th>Variação $</th>
        <th>Variação %</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="acao in acoesVisiveis"
          :key="acao.ticker"
          :class="{ blink: tickersAtualizados.has(acao.ticker) }"
      >
        <td>{{ acao.ticker }}</td>
        <td>{{ acao.preco?.toFixed(2) ?? '...' }}</td>
        <td :class="{
            positivo: acao.preco && acao.preco > acao.fechamento,
            negativo: acao.preco && acao.preco < acao.fechamento
          }">
          <span v-if="acao.preco">{{ (acao.preco - acao.fechamento).toFixed(2) }}</span>
          <span v-else>...</span>
        </td>
        <td :class="{
            positivo: acao.preco && acao.preco > acao.fechamento,
            negativo: acao.preco && acao.preco < acao.fechamento
          }">
          <span v-if="acao.preco">{{ (((acao.preco / acao.fechamento) - 1) * 100).toFixed(2) }}%</span>
          <span v-else>...</span>
        </td>
        <td>
          <button class="botao-remover" @click="removerAcao(acao.ticker)">
            Remover
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container-mercado {
  padding: 20px;
}

.acoes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}

.botao-adicionar {
  all: unset;
  cursor: pointer;
  background-color: #27ae60;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.botao-adicionar:hover {
  background-color: #2ecc71;
}

.tabela-acoes {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.tabela-acoes th, .tabela-acoes td {
  border: 1px solid #333;
  padding: 12px 15px;
  text-align: center;
}

.tabela-acoes th {
  background-color: rgb(27,30,47);
  color: white;
}

.positivo { color: #4caf50; }
.negativo { color: #f44336; }

.blink {
  animation: piscar 1s ease-in-out;
}

@keyframes piscar {
  0% { background-color: transparent; }
  50% { background-color: rgba(0, 150, 255, 0.2); }
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
</style>