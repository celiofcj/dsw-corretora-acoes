<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation
} from '@/utils/validators.ts'

const email = ref('');
const senha = ref('');
const confirmarSenha = ref('');

const emailTouched = ref(false);
const senhaTouched = ref(false);
const confirmarSenhaTouched = ref(false);

const serverErrorMessage = ref('');
const isSubmitting = ref(false);
const router = useRouter();

const url = 'http://localhost:3000/acesso';

const emailError = computed(() => {
  return emailTouched.value ? validateEmail(email.value) : '';
});

const senhaError = computed(() => {
  return senhaTouched.value ? validatePassword(senha.value) : '';
});

const confirmarSenhaError = computed(() => {
  return confirmarSenhaTouched.value ? validatePasswordConfirmation(senha.value, confirmarSenha.value) : '';
});

const isFormInvalid = computed(() => {
  return !!(validateEmail(email.value) || validatePassword(senha.value) || validatePasswordConfirmation(senha.value, confirmarSenha.value));
});

const registrar = async () => {
  emailTouched.value = true;
  senhaTouched.value = true;
  confirmarSenhaTouched.value = true;

  await nextTick();

  if (isFormInvalid.value) {
    return;
  }

  isSubmitting.value = true;
  serverErrorMessage.value = '';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        senha: senha.value,
      }),
    });

    if (response.status === 201) {
      router.push('/login');
    } else {
      const errorData = await response.json();
      serverErrorMessage.value = errorData.message || 'Ocorreu um erro ao criar a conta.';
    }
  } catch (error) {
    serverErrorMessage.value = 'Não foi possível conectar ao servidor.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="registrar" class="login-form" novalidate>
      <h1>Criar Conta</h1>

      <div class="form-group">
        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            v-model="email"
            @blur="emailTouched = true"
            required
            autocomplete="email"
            :class="{ 'input-error': emailError }"
        />
        <p v-if="emailError" class="field-error-message">{{ emailError }}</p>
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input
            id="password"
            type="password"
            v-model="senha"
            @blur="senhaTouched = true"
            required
            autocomplete="new-password"
            :class="{ 'input-error': senhaError }"
        />
        <p v-if="senhaError" class="field-error-message">{{ senhaError }}</p>
      </div>

      <div class="form-group">
        <label for="confirm-password">Confirmar Senha</label>
        <input
            id="confirm-password"
            type="password"
            v-model="confirmarSenha"
            @blur="confirmarSenhaTouched = true"
            required
            autocomplete="new-password"
            :class="{ 'input-error': confirmarSenhaError }"
        />
        <p v-if="confirmarSenhaError" class="field-error-message">{{ confirmarSenhaError }}</p>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Cadastrando...' : 'Cadastrar' }}
      </button>

      <p v-if="serverErrorMessage" class="error-message">{{ serverErrorMessage }}</p>

      <div class="links">
        <router-link to="/login">Já tem uma conta? Faça login</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  padding: 1em;
  padding-bottom: 4em;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  margin-bottom: 0.25rem;
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
  margin-top: 1rem;
}

button:hover {
  background-color: hsla(160, 100%, 37%, 0.8);
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
  margin-top: 1rem;
}

.links {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.links a {
  color: hsla(160, 100%, 37%, 1);
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style>