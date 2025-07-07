<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const senha = ref('');
const errorMessage = ref('');
const router = useRouter();

interface Token {
  token: string;
}

const url = 'http://localhost:3000/acesso'

const login = async () => {
  errorMessage.value = '';
  try {
    const response = await fetch(url + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        senha: senha.value,
      }),
    });

    if (response.ok) {
      const data: Token = await response.json();
      localStorage.setItem('authToken', data.token);
      router.push('/carteira');
    } else {
      const errorData = await response.json();
      errorMessage.value = errorData.message || 'E-mail ou senha inválidos.';
    }
  } catch (error) {
    errorMessage.value = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
  }
};
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h1>Login</h1>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required autocomplete="email" value="celiofcjunior@edu.unirio.br"/>
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" type="password" v-model="senha" required autocomplete="current-password" value="controle1"/>
      </div>
      <button type="submit">Entrar</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="links">
        <router-link to="/recuperar-senha">Esqueceu a senha?</router-link>
        <router-link to="/criar-conta">Criar uma conta</router-link>
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

button:hover {
  background-color: hsla(160, 100%, 37%, 1);
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
}

.links {
  display: flex;
  justify-content: space-between;
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