<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <PresenFooter />
  </div>
</template>
<script setup lang="ts">
useState('isShowShare', () => false)
</script>