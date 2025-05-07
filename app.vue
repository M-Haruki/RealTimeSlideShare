<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <PresenFooter />
  </div>
</template>
<script setup lang="ts">
const isShowShare = useState('isShowShare', () => false)
</script>