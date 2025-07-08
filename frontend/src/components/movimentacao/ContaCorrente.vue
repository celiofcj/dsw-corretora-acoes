<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import emitter from "@/processing/eventBus.ts";
import {
  type TipoMovimentacao,
  TipoMovimentacaoInfo,
  type TipoTransacaoId
} from '@/types/movimentacaoTypes.ts';
import {useMovimentacao} from "@/composable/useMovimentacao.ts";
import BotoesTransferencia from "@/components/movimentacao/BotoesTransferencia.vue";
import ModalTransferencia from "@/components/movimentacao/ModalTransferencia.vue";

const {
  contaCorrente,
  movimentacoes,
  erro,
  isSubmitting,
  getContaCorrente,
  getMovimentacoes,
  registrarMovimentacao,
} = useMovimentacao();

const showModal = ref(false);
const modalType = ref<'DEPOSITO' | 'RETIRADA' | null>(null);
const apiError = ref<string | null>(null);

const openModal = (type: 'DEPOSITO' | 'RETIRADA') => {
  modalType.value = type;
  apiError.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = null;
};

const registrarTransacao = async (payload: { descricao: string; valor: number; tipo: 'DEPOSITO' | 'RETIRADA' }) => {
  apiError.value = null;
  try {
    await registrarMovimentacao(payload);
    await getContaCorrente();
    await getMovimentacoes();
    closeModal();
  } catch (e: any) {
    apiError.value = e.message;
    console.error(e);
  }
};

const onProcessComplete = () => {
  console.log(`[ListenerComponent] Evento 'process:complete' recebido!`);
  getContaCorrente();
  getMovimentacoes();
};

onMounted(() => {
  console.log('On mount');
  getContaCorrente();
  getMovimentacoes();
  emitter.on('time-process:complete', onProcessComplete);
});

onUnmounted(() => {
  console.log('On unmount');
  emitter.off('time-process:complete', onProcessComplete);
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
};

const getTransactionTypeClass = (tipo: TipoTransacaoId) => {
  const movimentacaoKey = Object.keys(TipoMovimentacaoInfo).find(
      (key) => TipoMovimentacaoInfo[key as TipoMovimentacao].id === tipo
  ) as TipoMovimentacao | undefined;

  if (movimentacaoKey) {
    const operacao = TipoMovimentacaoInfo[movimentacaoKey].operacao;
    return operacao === 'entrada' ? 'texto-sucesso' : 'texto-perigo';
  }
  return '';
};

const getTransactionTypeText = (tipo: TipoTransacaoId) => {
  return tipo.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

</script>

<template>

  <div class="container-botoes">
    <BotoesTransferencia @open-modal="openModal"/>
  </div>
  <div class="container-conta">
    <div v-if="erro" class="mensagem-erro">{{ erro }}</div>

    <div v-if="contaCorrente" class="secao-saldo">
      <h2>Saldo da Conta Corrente</h2>
      <p class="valor-saldo">{{ formatCurrency(contaCorrente.saldo) }}</p>
    </div>

    <div class="secao-movimentacoes">
      <h2>Últimas Movimentações</h2>
      <table v-if="movimentacoes.length > 0" class="tabela-movimentacoes">
        <thead>
        <tr>
          <th>Descrição</th>
          <th>Data/Hora</th>
          <th>Tipo</th>
          <th class="texto-direita">Valor</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="mov in movimentacoes" :key="mov._id">
          <td>{{ mov.descricao }}</td>
          <td>{{ formatDate(mov.dataHora) }}</td>
          <td>{{ getTransactionTypeText(mov.tipo) }}</td>
          <td :class="[getTransactionTypeClass(mov.tipo), 'texto-direita']">
            {{ formatCurrency(mov.valor) }}
          </td>
        </tr>
        </tbody>
      </table>
      <p v-else>Nenhuma movimentação encontrada.</p>
    </div>

    <ModalTransferencia
        :show="showModal"
        :type="modalType"
        :is-submitting="isSubmitting"
        :api-error="apiError"
        @close="closeModal"
        @submit="registrarTransacao"
    />
  </div>
</template>

<style scoped>
.container-botoes {
  padding: 2em 2em 0;
  display: flex;
  justify-content: center;
}

.container-conta {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.secao-saldo {
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
  padding: 1em 1em 0 0;
}

.secao-saldo h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.25em;
}

.valor-saldo {
  margin-top: 0;
  font-size: 1.5em;
  font-weight: bold;
  color: hsla(160, 100%, 37%, 1);
}

.secao-movimentacoes h2 {
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.tabela-movimentacoes {
  width: 100%;
  border-collapse: collapse;
}

.tabela-movimentacoes th, .tabela-movimentacoes td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.tabela-movimentacoes th {
  background-color: #f7f7f7;
  font-weight: bold;
}

.tabela-movimentacoes tbody tr:hover {
  background-color: #f1f1f1;
}

.texto-direita {
  text-align: right;
}

.texto-sucesso {
  color: hsla(160, 100%, 37%, 1);
  font-weight: bold;
}

.texto-perigo {
  color: #dc3545;
  font-weight: bold;
}

.mensagem-erro {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>