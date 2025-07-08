<script setup lang="ts">
defineEmits<{
  (e: 'open-modal', type: 'DEPOSITO' | 'RETIRADA'): void
}>();
</script>

<template>
  <div class="secao-acoes">
    <button @click="$emit('open-modal', 'DEPOSITO')" class="btn-acao btn-deposito">Registrar Depósito</button>
    <button @click="$emit('open-modal', 'RETIRADA')" class="btn-acao btn-retirada">Registrar Retirada</button>
  </div>
</template>

<style scoped>
.secao-acoes {
  display: flex;
  gap: 10px;
}

.btn-acao {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  transition: background-color 0.2s;
}

.btn-deposito {
  background-color: hsla(160, 100%, 37%, 1);
}

.btn-deposito:hover {
  background-color: hsla(160, 100%, 30%, 1);
}

.btn-retirada {
  background-color: #dc3545;
}

.btn-retirada:hover {
  background-color: #c82333;
}
</style>