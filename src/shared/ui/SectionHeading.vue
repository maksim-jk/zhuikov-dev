<script setup lang="ts">
defineProps<{
  index: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="section-heading">
    <span
      v-reveal
      class="section-heading__index"
    >
      <span
        class="section-heading__led"
        aria-hidden="true"
      />
      {{ index }}
    </span>
    <h2
      v-reveal="0.08"
      class="section-heading__title"
    >
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      v-reveal="0.16"
      class="section-heading__subtitle"
    >
      {{ subtitle }}
    </p>
  </header>
</template>

<style lang="scss" scoped>
.section-heading {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px 24px;
  margin-bottom: clamp(40px, 6vw, 72px);

  @include container;

  @include respond($bp-md) {
    grid-template-columns: 1fr;
  }

  &__index {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 0.6em;

    @include label;
  }

  &__led {
    @include led(6px);
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.2rem, 5.5vw, 4.5rem);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  &__subtitle {
    grid-column: 2;
    max-width: 56ch;
    font-size: 1.05rem;
    line-height: 1.6;
    color: $color-muted;

    @include respond($bp-md) {
      grid-column: 1;
    }
  }
}
</style>
