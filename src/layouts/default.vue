<template>
  <div class="layout">
    <TheCircuitBackground />
    <TheHeader />
    <main class="layout__main">
      <slot />
    </main>
    <TheScrollTop />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
  }
}
</style>
