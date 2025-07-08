<script setup lang="ts">
import { ref, watch } from 'vue';

type TransactionPayload = {
  descricao: string;
  valor: number;
  tipo: 'DEPOSITO' | 'RETIRADA';
};

const props = defineProps<{
  show: boolean;
  type: 'DEPOSITO' | 'RETIRADA' | null;
  isSubmitting: boolean;
  apiError: string | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: TransactionPayload): void;
}>();

const newTransaction = ref<{ descricao: string; valor: number | null }>({ descricao: '', valor: null });
const validationError = ref<string | null>(null);

watch(() => props.show, (newVal) => {
  if (newVal) {
    newTransaction.value = { descricao: '', valor: null };
    validationError.value = null;
  }
});

const submitForm = () => {
  validationError.value = null;
  if (!newTransaction.value.descricao.trim() || !newTransaction.value.valor || newTransaction.value.valor <= 0) {
    validationError.value = 'Descrição e valor (positivo e não-zero) são obrigatórios.';
    return;
  }
  emit('submit', {
    descricao: newTransaction.value.descricao,
    valor: newTransaction.value.valor,
    tipo: props.type!,
  });
};

const closeModal = () => {
  if (!props.isSubmitting) {
    emit('close');
  }
};
</script>

<template>
  <div v-if="show" class="modal-fundo" @click.self="closeModal">
    <div class="modal-conteudo">
      <h2>Registrar {{ type === 'DEPOSITO' ? 'Depósito' : 'Retirada' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="grupo-formulario">
          <label for="descricao">Descrição</label>
          <input type="text" id="descricao" v-model="newTransaction.descricao" required>
        </div>
        <div class="grupo-formulario">
          <label for="valor">Valor (R$)</label>
          <input type="number" id="valor" v-model.number="newTransaction.valor" min="0.01" step="0.01" required>
        </div>
        <div v-if="validationError" class="modal-mensagem-erro">{{ validationError }}</div>
        <div v-if="apiError" class="modal-mensagem-erro">{{ apiError }}</div>
        <div class="modal-acoes">
          <button type="button" @click="closeModal" class="btn-cancelar" :disabled="isSubmitting">Cancelar</button>
          <button type="submit" class="btn-confirmar" :disabled="isSubmitting">
            {{ isSubmitting ? 'Processando...' : 'Confirmar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-fundo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-conteudo {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-conteudo h2 {
  margin-top: 0;
  margin-bottom: 20px;
}

.grupo-formulario {
  margin-bottom: 15px;
}

.grupo-formulario label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.grupo-formulario input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-acoes button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.btn-cancelar {
  background-color: #6c757d;
  color: white;
}
.btn-cancelar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-confirmar {
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
}

.btn-confirmar:disabled {
  background-color: hsla(160, 100%, 37%, 1);
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-mensagem-erro {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  font-size: 0.9em;
  text-align: center;
}
</style>