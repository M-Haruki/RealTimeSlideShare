<script setup lang="ts">
const error = useError()
</script>

<template>
  <div>
    <h1>{{ error?.statusCode }}</h1>
    <p>{{ error?.message }}</p>
    <p @click="$router.go(-1);">
      <u>back</u>
    </p>
    <p @click="$router.push('/');">
      <u>Top</u>
    </p>
  </div>
</template>