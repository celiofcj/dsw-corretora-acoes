<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import emitter from "@/processing/eventBus.ts";
import {
  type IContaCorrente,
  type IMovimentacao,
  type TipoMovimentacao,
  TipoMovimentacaoInfo,
  type TipoTransacaoId
} from '@/types/movimentacaoTypes.ts';
import {useRouter} from "vue-router";

const router = useRouter();
const contaCorrente = ref<IContaCorrente | null>(null);
const movimentacoes = ref<IMovimentacao[]>([]);
const erro = ref<string | null>(null);

const url = 'http://localhost:3000/movimentacao'
const token = localStorage.getItem('authToken');

const fetchContaCorrente = async () => {
  contaCorrente.value = await fetch(url + '/contaCorrente',
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(response => {
        if (response.status === 401) {
          router.push('/login')
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar o saldo da conta.')
        }

        return response.json()
      })
      .catch(error => {
        erro.value = 'Erro ao carregar o saldo da conta.';
        console.error(error);
      });
};

const fetchMovimentacoes = async () => {

    movimentacoes.value = await fetch(url + '/',
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        .then(response => {
          if (response.status === 401) {
            router.push('/login')
          }

          if (!response.ok) {
            throw new Error('Erro ao carregar as movimentações.')
          }

          return response.json()
        })
        .catch(error => {
          console.error(error)
        })
};

const onProcessComplete = () => {
  console.log(`[ListenerComponent] Evento 'process:complete' recebido!`);
  fetchContaCorrente();
  fetchMovimentacoes();
};

onMounted(() => {
  console.log('On mount');
  fetchContaCorrente();
  fetchMovimentacoes();
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
    return operacao === 'entrada' ? 'text-success' : 'text-danger';
  }
  return '';
};

const getTransactionTypeText = (tipo: TipoTransacaoId) => {
  return tipo.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

</script>

<template>
  <div class="account-container">
    <div v-if="erro" class="error-message">{{ erro }}</div>

    <div v-if="contaCorrente" class="balance-section">
      <h2>Saldo da Conta Corrente</h2>
      <p class="balance-value">{{ formatCurrency(contaCorrente.saldo) }}</p>
    </div>

    <div class="transactions-section">
      <h2>Últimas Movimentações</h2>
      <table v-if="movimentacoes.length > 0" class="transactions-table">
        <thead>
        <tr>
          <th>Descrição</th>
          <th>Data/Hora</th>
          <th>Tipo</th>
          <th class="text-right">Valor</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="mov in movimentacoes" :key="mov._id">
          <td>{{ mov.descricao }}</td>
          <td>{{ formatDate(mov.dataHora) }}</td>
          <td>{{ getTransactionTypeText(mov.tipo) }}</td>
          <td :class="getTransactionTypeClass(mov.tipo)" class="text-right">
            {{ formatCurrency(mov.valor) }}
          </td>
        </tr>
        </tbody>
      </table>
      <p v-else>Nenhuma movimentação encontrada.</p>
    </div>
  </div>
</template>

<style scoped>
.account-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.balance-section {
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: left;
  padding: 1em 1em 0 0;
}

.balance-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.25em;
}

.balance-value {
  margin-top: 0;
  font-size: 1.5em;
  font-weight: bold;
  color: hsla(160, 100%, 37%, 1);
}

.transactions-section h2 {
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th, .transactions-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.transactions-table th {
  background-color: #f7f7f7;
  font-weight: bold;
}

.transactions-table tbody tr:hover {
  background-color: #f1f1f1;
}

.text-right {
  text-align: right;
}

.text-success {
  color: #28a745;
  font-weight: bold;
}

.text-danger {
  color: #dc3545;
  font-weight: bold;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>