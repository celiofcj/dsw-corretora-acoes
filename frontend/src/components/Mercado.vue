<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue';
import ModalAdicionarAcao from './movimentacao/ModalAdicionarAcao.vue';
import ModalComprarAcao from './movimentacao/ModalComparAcao.vue';
import emitter, {type HoraOperacao} from "@/processing/eventBus.ts";

interface AcaoMestra {
  ticker: string;
  fechamento: number;
}

export interface IAcaoInteresse {
  id: string;
  ticker: string;
  ordem: number;
}

interface AcaoNaTabela extends IAcaoInteresse {
  preco?: number;
  fechamento?: number;
}

let hora = 12;
let minuto = 0;
let todasAsAcoes: AcaoMestra[] = [];
const precosAtuaisMap = ref(new Map<string, number>());
const tickersAtualizados = ref(new Set<string>());
const mostrarModal = ref(false);
const carregando = ref(true);
const acoesDeInteresse = ref<IAcaoInteresse[]>([]);
const mostrarModalCompra = ref(false);
const acaoSelecionadaParaCompra = ref<{ acao: AcaoNaTabela, hora: number, minuto: number } | null>(null);


async function fetchAcoesInteresse() {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:3000/acaoInteresse/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Falha ao buscar ações de interesse.');
  acoesDeInteresse.value = await response.json();
}

async function salvarAcaoInteresse(ticker: string, ordem: number) {
  const token = localStorage.getItem('authToken');
  await fetch('http://localhost:3000/acaoInteresse/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ ticker, ordem })
  });
}

async function removerAcaoInteresse(id: string) {
  const token = localStorage.getItem('authToken');
  await fetch(`http://localhost:3000/acaoInteresse/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  await fetchAcoesInteresse();
}

async function subirAcao(id: string) {
  const token = localStorage.getItem('authToken');
  await fetch(`http://localhost:3000/acaoInteresse/${id}/subir`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  await fetchAcoesInteresse();
}

async function descerAcao(id: string) {
  const token = localStorage.getItem('authToken');
  await fetch(`http://localhost:3000/acaoInteresse/${id}/descer`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  await fetchAcoesInteresse();
}

const TICKERS_URL = 'https://raw.githubusercontent.com/marciobarros/dsw-simulador-corretora/refs/heads/main/tickers.json';
const PRECO_URL_BASE = 'https://raw.githubusercontent.com/marciobarros/dsw-simulador-corretora/refs/heads/main/';

async function fetchPrecosAtuais() {
  try {
    const response = await fetch(`${PRECO_URL_BASE}${minuto}.json`);
    const precos: { ticker: string, preco: number }[] = await response.json();
    tickersAtualizados.value.clear();
    const novoMapa = new Map(precos.map(p => [p.ticker, p.preco]));
    novoMapa.forEach((preco, ticker) => {
      if (precosAtuaisMap.value.get(ticker) !== preco) {
        tickersAtualizados.value.add(ticker);
      }
    });
    precosAtuaisMap.value = novoMapa;
    setTimeout(() => tickersAtualizados.value.clear(), 1000);
  } catch (error) {
    console.error('Erro ao buscar preços atuais:', error);
  }
}

const acoesNaTabela = computed((): AcaoNaTabela[] => {
  const mapaFechamento = new Map(todasAsAcoes.map(a => [a.ticker, a.fechamento]));
  return acoesDeInteresse.value.map(interesse => ({
    ...interesse,
    preco: precosAtuaisMap.value.get(interesse.ticker),
    fechamento: mapaFechamento.get(interesse.ticker)
  }));
});

const acoesDisponiveis = computed(() => {
  const tickersVisiveis = new Set(acoesDeInteresse.value.map(a => a.ticker));
  return todasAsAcoes.filter(a => !tickersVisiveis.has(a.ticker));
});

async function handleAdicionarAcao(ticker: string) {
  const proximaOrdem = acoesDeInteresse.value.length;
  await salvarAcaoInteresse(ticker, proximaOrdem);
  await fetchAcoesInteresse();
}

const onProcessComplete = (horaOperacao: HoraOperacao) => {
  console.log(`[Listener Mercado] Evento 'process:complete' recebido!`);
  hora = horaOperacao.hora;
  minuto = horaOperacao.minuto;
  fetchPrecosAtuais();
};

function abrirModalCompra(acao: AcaoNaTabela) {
  acaoSelecionadaParaCompra.value = {
    acao: acao,
    hora: hora,
    minuto: minuto
  };
  mostrarModalCompra.value = true;
}

onMounted(async () => {
  try {
    emitter.on('time-process:complete', onProcessComplete);

    const response = await fetch(TICKERS_URL);
    todasAsAcoes = await response.json();

    await fetchAcoesInteresse();

    if (acoesDeInteresse.value.length === 0) {
      const acoesIniciais = [...todasAsAcoes].sort(() => 0.5 - Math.random()).slice(0, 10);
      for (let i = 0; i < acoesIniciais.length; i++) {
        await salvarAcaoInteresse(acoesIniciais[i].ticker, i);
      }
      await fetchAcoesInteresse();
    }

    emitter.on('time-now:response', onProcessComplete)
    emitter.emit('time-now:request')

    await fetchPrecosAtuais();
  } catch (error) {
    console.error("Erro ao inicializar o componente:", error);
  } finally {
    carregando.value = false;
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
      @adicionar="handleAdicionarAcao"
  />

  <ModalComprarAcao
      v-if="mostrarModalCompra && acaoSelecionadaParaCompra"
      :acao="acaoSelecionadaParaCompra.acao"
      :hora-simulada="acaoSelecionadaParaCompra.hora"
      :minuto-simulado="acaoSelecionadaParaCompra.minuto"
      @fechar="mostrarModalCompra = false"
  />

  <div class="container-mercado">
    <div class="acoes-header">
      <h2>Ações de Interesse</h2>
      <button @click="mostrarModal = true" class="botao-adicionar">Adicionar Ação</button>
    </div>

    <div v-if="carregando">Carregando mercado...</div>

    <table v-else class="tabela-acoes">
      <thead>
      <tr>
        <th>Ordem</th>
        <th>Ticker</th>
        <th>Preço</th>
        <th>Variação $</th>
        <th>Variação %</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(acao, index) in acoesNaTabela"
          :key="acao.id"
          :class="{ blink: tickersAtualizados.has(acao.ticker) }"
      >
        <td class="coluna-ordem">
          <button @click="subirAcao(acao.id)" :disabled="index === 0" class="botao-ordem">↑</button>
          <button @click="descerAcao(acao.id)" :disabled="index === acoesNaTabela.length - 1" class="botao-ordem">↓</button>
        </td>

        <td>{{ acao.ticker }}</td>

        <td>{{ acao.preco?.toFixed(2) ?? '...' }}</td>

        <td :class="{
            positivo: acao.preco && acao.fechamento && acao.preco > acao.fechamento,
            negativo: acao.preco && acao.fechamento && acao.preco < acao.fechamento
          }">
          <span v-if="acao.preco && acao.fechamento">{{ (acao.preco - acao.fechamento).toFixed(2) }}</span>
          <span v-else>...</span>
        </td>

        <td :class="{
            positivo: acao.preco && acao.fechamento && acao.preco > acao.fechamento,
            negativo: acao.preco && acao.fechamento && acao.preco < acao.fechamento
          }">
          <span v-if="acao.preco && acao.fechamento">{{ (((acao.preco / acao.fechamento) - 1) * 100).toFixed(2) }}%</span>
          <span v-else>...</span>
        </td>

        <td class="coluna-acoes-geral">
          <button class="botao-tabela botao-comprar" @click="abrirModalCompra(acao)">Comprar</button>
          <button class="botao-tabela botao-remover" @click="removerAcaoInteresse(acao.id)">Remover</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container-mercado {
  padding: 16px;
  font-family: sans-serif;
}

.acoes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}

.tabela-acoes {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.tabela-acoes th,
.tabela-acoes td {
  padding: 10px 12px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.tabela-acoes th {
  text-align: center;
  font-weight: bold;
  color: #333;
}

.positivo {
  color: #1a9c5a;
  font-weight: 500;
}
.negativo {
  color: #d83131;
  font-weight: 500;
}

.blink {
  animation: piscar 0.7s ease-in-out;
}
@keyframes piscar {
  0% { background-color: transparent; }
  50% { background-color: #0A192F; }
  100% { background-color: transparent; }
}

.botao-adicionar {
  all: unset;
  cursor: pointer;
  background-color: #27ae60;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s;
}
.botao-adicionar:hover {
  background-color: #2ecc71;
}

.botao-tabela {
  all: unset;
  cursor: pointer;
  color: white;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  transition: background-color 0.2s;
}
.botao-tabela:hover {
  opacity: 0.9;
}

.botao-comprar {
  background-color: #27ae60;
}
.botao-remover {
  background-color: #d83131;
}
.botao-ordem {
  background-color: #7f8c8d;
  font-size: 16px;
  padding: 2px 8px;
}
.botao-ordem:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>