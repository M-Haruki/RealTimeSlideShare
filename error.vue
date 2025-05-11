<template>
  <div>
    <header>
      <h1 class="title">Error</h1>
    </header>
    <div class="content">
      <h2 class="status">{{ error?.statusCode }}</h2>
      <h3>{{ error?.message }}</h3>
      <p class="link" @click="$router.go(-1);">
        Back to Previous Page
      </p>
      <p class="link" @click="$router.push('/');">
        Go to Home Page
      </p>
    </div>
    <PresenFooter />
  </div>
</template>

<script setup lang="ts">
const error = useError()
</script>

<style scoped lang="scss">
header {
  width: 100vw;
  height: $header-height;
  background-color: $color-primary;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: $color-body-primary;
  padding: 8px;

  h1 {
    font-size: 1.8rem;
    font-weight: bold;
    align-items: center;
  }
}

.content {
  text-align: center;
  width: 100vw;
  height: calc(100vh - $header-height - $footer-height);
  background-color: $color-primary;
  color: $color-body-primary;
  padding: 8px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;

  h2 {
    font-size: 3rem;
    color: $color-body-primary;
  }

  h3 {
    font-size: 2rem;
    margin: 0 0 20px 0;
  }

  .link {
    font-size: 1.2rem;
    color: $color-body-primary;
    width: 80%;
    max-width: 800px;
    text-align: center;
    margin-top: 20px;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>