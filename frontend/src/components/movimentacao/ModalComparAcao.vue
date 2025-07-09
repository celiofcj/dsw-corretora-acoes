<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';

// --- DEFINIÇÃO DE TIPOS ---
interface AcaoParaCompra {
  ticker: string;
  preco?: number;
}

interface PedidoOrdemCompra {
  ticker: string;
  quantidade: number;
  preco: number;
  executada: boolean;
  dataHora: string; // Corrigido para string
}

// --- PROPRIEDADES E EVENTOS ---
const props = defineProps<{
  acao: AcaoParaCompra;
  horaSimulada: number; // Recebe a hora da simulação
  minutoSimulado: number; // Recebe o minuto da simulação
}>();

const emit = defineEmits(['fechar', 'ordemCriada']);

// --- ESTADO REATIVO DO FORMULÁRIO ---
const tipoOrdem = ref<'mercado' | 'agendada'>('mercado');
const quantidade = ref<number>(1);
const precoAgendado = ref<number>(props.acao.preco ?? 0);
const carregando = ref(false);
const erroApi = ref<string | null>(null);

const isFormInvalido = computed(() => {
  if (quantidade.value <= 0) return true;
  if (tipoOrdem.value === 'agendada' && precoAgendado.value <= 0) return true;
  return false;
});

// --- LÓGICA DE SUBMISSÃO ---
async function handleConfirmarCompra() {
  erroApi.value = null;
  carregando.value = true;

  // Lógica para gerar a data/hora simulada
  const agora = new Date();
  const dataServidor = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate(),
      props.horaSimulada,
      props.minutoSimulado
  );
  dataServidor.setHours(dataServidor.getHours());
  const dataHoraSimulada = dataServidor.toISOString();

  // Monta o payload para a API
  const payload: PedidoOrdemCompra = {
    ticker: props.acao.ticker,
    quantidade: quantidade.value,
    dataHora: dataHoraSimulada,
    preco: tipoOrdem.value === 'mercado' ? (props.acao.preco ?? 0) : precoAgendado.value,
    executada: tipoOrdem.value === 'mercado'
  };

  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:3000/ordemCompra', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.message || 'Ocorreu um erro ao criar a ordem.');
    }

    emit('ordemCriada');
    emit('fechar');

  } catch (error: any) {
    erroApi.value = error.message;
  } finally {
    carregando.value = false;
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('fechar')">
    <div class="modal-content">
      <h3>Comprar Ação: {{ props.acao.ticker }}</h3>
      <p>Preço atual: <strong>R$ {{ props.acao.preco?.toFixed(2) }}</strong></p>

      <div class="form-group">
        <label for="quantidade">Quantidade:</label>
        <input type="number" id="quantidade" v-model.number="quantidade" min="1" class="form-input"/>
      </div>

      <div class="form-group">
        <label>Tipo de Ordem:</label>
        <div class="radio-group">
          <label>
            <input type="radio" v-model="tipoOrdem" value="mercado" /> A Mercado
          </label>
          <label>
            <input type="radio" v-model="tipoOrdem" value="agendada" /> Agendada
          </label>
        </div>
      </div>

      <div v-if="tipoOrdem === 'agendada'" class="form-group">
        <label for="preco-agendado">Preço Agendado (Comprar se <=):</label>
        <input type="number" id="preco-agendado" v-model.number="precoAgendado" step="0.01" class="form-input"/>
      </div>

      <div v-if="erroApi" class="error-message">{{ erroApi }}</div>

      <div class="modal-actions">
        <button @click="emit('fechar')" class="botao-modal botao-cancelar">Cancelar</button>
        <button @click="handleConfirmarCompra" :disabled="isFormInvalido || carregando" class="botao-modal botao-confirmar">
          {{ carregando ? 'Enviando...' : 'Confirmar Compra' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.7); display: flex;
  justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: #2c3e50; padding: 25px; border-radius: 10px;
  width: 90%; max-width: 450px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); color: white;
}
.form-group {
  margin-bottom: 1.2em;
}
.form-group label {
  display: block;
  margin-bottom: 0.5em;
}
.form-input {
  width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444;
  background-color: #333; color: white; font-size: 16px; box-sizing: border-box;
}
.radio-group {
  display: flex;
  gap: 20px;
}
.modal-actions {
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;
}
.botao-modal {
  all: unset; cursor: pointer; padding: 10px 20px; border-radius: 5px;
  font-weight: bold; transition: background-color 0.2s;
}
.botao-cancelar { background-color: #7f8c8d; }
.botao-confirmar { background-color: #27ae60; }
.botao-confirmar:disabled { background-color: #555; cursor: not-allowed; }
.error-message {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.2);
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  text-align: center;
}
</style>