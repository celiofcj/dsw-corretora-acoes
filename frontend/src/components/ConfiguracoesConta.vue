<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  validatePassword,
  validatePasswordConfirmation
} from '@/utils/validators';

const router = useRouter();

const senha = ref('');
const confirmarSenha = ref('');
const serverErrorMessage = ref('');

const senhaTouched = ref(false);
const confirmarSenhaTouched = ref(false);
const isSubmitting = ref(false);

const url = 'http://localhost:3000/acesso';
const token = localStorage.getItem('authToken');

const senhaError = computed(() => {
  return senhaTouched.value ? validatePassword(senha.value) : '';
});

const confirmarSenhaError = computed(() => {
  return confirmarSenhaTouched.value ? validatePasswordConfirmation(senha.value, confirmarSenha.value) : '';
});

const isFormInvalid = computed(() => {
  return !!(validatePassword(senha.value) || validatePasswordConfirmation(senha.value, confirmarSenha.value));
});

const trocarSenha = async () => {
  serverErrorMessage.value = '';
  senhaTouched.value = true;
  confirmarSenhaTouched.value = true;

  await nextTick();

  if (isFormInvalid.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch(url + '/trocarSenha', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senha: senha.value
      })
    });

    if (response.status === 401) {
      serverErrorMessage.value = 'Sua sessão expirou. Faça login novamente.';
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    if (!response.ok) {
      throw new Error('Ocorreu um erro ao trocar de senha.');
    }

    router.push('/login');

  } catch (error: any) {
    serverErrorMessage.value = error.message || 'Não foi possível conectar ao servidor.';
  } finally {
    isSubmitting.value = false;
  }
};

const sair = () => {
  localStorage.clear()
  router.push('/login')
}

</script>

<template>
  <div class="configuracoesConta-container">
    <div>
      <button class="btn-vermelho" @click="sair()">Sair</button>
    </div>
    <form class="trocar-senha-form" @submit.prevent="trocarSenha" novalidate>
      <h3>Trocar de senha</h3>
      <div class="form-group">
        <label for="nova-senha">Nova senha</label>
        <input
            id="nova-senha"
            type="password"
            v-model="senha"
            @blur="senhaTouched = true"
            required
            autocomplete="new-password"
            :class="{'input-error': senhaError}"
        >
        <p v-if="senhaError" class="field-error-message">{{ senhaError }}</p>
      </div>
      <div class="form-group">
        <label for="confirmar-nova-senha">Confirmar nova senha</label>
        <input
            id="confirmar-nova-senha"
            type="password"
            v-model="confirmarSenha"
            @blur="confirmarSenhaTouched = true"
            required
            autocomplete="new-password"
            :class="{'input-error': confirmarSenhaError}"
        >
        <p v-if="confirmarSenhaError" class="field-error-message">{{ confirmarSenhaError }}</p>
      </div>
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Trocando...' : 'Trocar senha' }}
      </button>
      <p v-if="serverErrorMessage" class="error-message">{{ serverErrorMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
.configuracoesConta-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.configuracoesConta-container:first-child {
  padding-top: 2em;
}

.trocar-senha-form {
  padding: 1em 1em 4em;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  text-align: left;
  color: #333;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  margin-bottom: 0.5rem;
  color: #555;
}

input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: hsla(160, 100%, 37%, 1);
}

input.input-error {
  border-color: #dc3545;
}

button {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: hsla(160, 100%, 37%, 0.8);
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-vermelho {
  background-color: #dc3545;
}

.btn-vermelho:hover {
  background-color: #c82333;
}

.field-error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin: 0;
  padding: 0;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
}
</style>