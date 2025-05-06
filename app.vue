<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
const isShowShare = useState('isShowShare', () => false)
</script>