<script setup lang="ts">

  const logado: boolean = true ;


</script>

<template>
  <div v-if="logado" >
    <div>
      <h1>Bem-vindo à página inicial dos professores!</h1>
      <p>Aqui você pode acessar informações importantes sobre os professores.</p>
    </div>

  </div>

  <div v-else> 
    <p>VOCE NAO ESTA LOGADO!</p>
  </div>
</template>
