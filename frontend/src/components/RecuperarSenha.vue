<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const step = ref(1);
const email = ref('');
const token = ref('');
const newPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

const url = 'http://localhost:3000/acesso'

const requestToken = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;


  try {
    const response = await fetch(url + '/tokenNovaSenha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    });

    if (response.ok) {
      successMessage.value = 'Se o e-mail estiver cadastrado, um código foi enviado para sua caixa de entrada.';
      step.value = 2;
    } else {
      const errorData = await response.json();
      errorMessage.value = errorData.message || 'Falha ao solicitar o token. Tente novamente.';
    }
  } catch (error) {
    errorMessage.value = 'Não foi possível conectar ao servidor.';
  } finally {
    isLoading.value = false;
  }
};

const resetPassword = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;
  try {
    const response = await fetch(url + '/recuperarSenha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        token: token.value,
        senha: newPassword.value,
      }),
    });

    if (response.ok) {
      successMessage.value = 'Senha alterada com sucesso! Você será redirecionado para o login.';
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      const errorData = await response.json();
      errorMessage.value = errorData.message || 'Token inválido ou expirado. Tente novamente.';
    }
  } catch (error) {
    errorMessage.value = 'Não foi possível conectar ao servidor.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="step === 1 ? requestToken() : resetPassword()" class="login-form">
      <h1>Recuperar Senha</h1>

      <div v-if="step === 1">
        <p>Insira seu e-mail para receber um código de recuperação.</p>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="email" required autocomplete="email" />
        </div>
      </div>

      <div v-if="step === 2">
        <p>Insira o código enviado para <strong>{{ email }}</strong> e sua nova senha.</p>
        <div class="form-group">
          <label for="token">Código de Recuperação</label>
          <input id="token" type="text" v-model="token" required />
        </div>
        <div class="form-group">
          <label for="new-password">Nova Senha</label>
          <input id="new-password" type="password" v-model="newPassword" required autocomplete="new-password" />
        </div>
      </div>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button type="submit" :disabled="isLoading">
        <span v-if="!isLoading && step === 1">Enviar Código</span>
        <span v-if="!isLoading && step === 2">Alterar Senha</span>
        <span v-if="isLoading">Aguarde...</span>
      </button>

      <div class="links">
        <router-link to="/login">Voltar para o Login</router-link>
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

p {
  color: #555;
  text-align: center;
  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;
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

button:hover:not(:disabled) {
  background-color: #00b377;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message,
.success-message {
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  margin-top: 1rem;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.success-message {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
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