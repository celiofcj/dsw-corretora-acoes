<script setup lang="ts">

import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const senha= ref('')
const confirmarSenha = ref('')
const errorMessage = ref('')

const url = 'http://localhost:3000/acesso'
const token = localStorage.getItem('authToken');

const trocarSenha = async () => {
  errorMessage.value = ''

  console.log(senha.value)
  if(senha.value !== confirmarSenha.value) {
    errorMessage.value = 'As senhas não coincidem'
    return
  }
  await fetch(url + '/trocarSenha', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      senha: senha.value
    })
  })
      .then(response => {
        if (response.status === 401) {
          new Promise(r => setTimeout(r, 5000));
          errorMessage.value = 'É preciso estar logado para trocar de senha!'
          router.push('/login')
        }

        if(!response.ok) {
          throw new Error('Ocorreu um erro ao trocar de senha')
        }

        router.push('/login')

      })
      .catch(() => {
        errorMessage.value = 'Ocorreu um erro ao trocar de senha'
      });
}

</script>

<template>
  <div class="configuracoesConta-container">
    <form class="trocar-senha-form" @submit.prevent="trocarSenha">
      <h3>Trocar de senha</h3>
      <div class="form-group">
        <label for="nova-senha">Nova senha</label>
        <input type="password" v-model="senha" required autocomplete="new-password">
      </div>
      <div class="form-group">
        <label for="nova-senha">Confirmar nova senha</label>
        <input type="password" v-model="confirmarSenha" required autocomplete="new-password">
      </div>
      <button type="submit">Trocar senha</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
.configuracoesConta-container {
  display: flex;
  justify-content: center;
  align-items: center;
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

.links a:hover {
  text-decoration: underline;
}
</style>