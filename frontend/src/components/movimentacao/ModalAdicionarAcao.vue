<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  acoes: { ticker: string; fechamento: number }[];
}>();

const emit = defineEmits(['fechar', 'adicionar']);

const tickerSelecionado = ref<string | null>(null);

function handleAdicionar() {
  if (tickerSelecionado.value) {
    emit('adicionar', tickerSelecionado.value);
    emit('fechar');
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('fechar')">
    <div class="modal-content">
      <h3>Adicionar Ação</h3>
      <p>Selecione uma ação para adicionar à sua lista de visualização.</p>

      <select v-model="tickerSelecionado" class="select-acao">
        <option :value="null" disabled>-- Escolha uma ação --</option>
        <option v-for="acao in props.acoes" :key="acao.ticker" :value="acao.ticker">
          {{ acao.ticker }}
        </option>
      </select>

      <div class="modal-actions">
        <button @click="emit('fechar')" class="botao-modal botao-cancelar">Cancelar</button>
        <button @click="handleAdicionar" :disabled="!tickerSelecionado" class="botao-modal botao-confirmar">Adicionar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #2c3e50;
  padding: 25px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  color: white;
}

h3 {
  margin-top: 0;
}

.select-acao {
  width: 100%;
  padding: 10px;
  margin: 20px 0;
  border-radius: 5px;
  border: 1px solid #444;
  background-color: #333;
  color: white;
  font-size: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.botao-modal {
  all: unset;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.botao-cancelar {
  background-color: #7f8c8d;
}
.botao-cancelar:hover {
  background-color: #95a5a6;
}

.botao-confirmar {
  background-color: #27ae60;
}
.botao-confirmar:hover {
  background-color: #2ecc71;
}
.botao-confirmar:disabled {
  background-color: #555;
  cursor: not-allowed;
}
</style>