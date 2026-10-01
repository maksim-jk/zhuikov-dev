<script setup lang="ts">
const { isVisible, ringRadius, ringLength, ringOffset, scrollToTop } = useScrollTop()
</script>

<template>
  <Transition name="scroll-top">
    <button
      v-if="isVisible"
      type="button"
      class="scroll-top"
      :aria-label="$t('nav.scroll-top')"
      :title="$t('nav.scroll-top')"
      @click="scrollToTop"
    >
      <svg
        class="scroll-top__ring"
        viewBox="0 0 60 60"
        aria-hidden="true"
      >
        <circle
          class="scroll-top__track"
          cx="30"
          cy="30"
          :r="ringRadius"
        />
        <circle
          class="scroll-top__progress"
          cx="30"
          cy="30"
          :r="ringRadius"
          :stroke-dasharray="ringLength"
          :stroke-dashoffset="ringOffset"
        />
      </svg>
      <span
        class="scroll-top__arrow"
        aria-hidden="true"
      >↑</span>
    </button>
  </Transition>
</template>

<style lang="scss" scoped>
.scroll-top {
  position: fixed;
  right: max(24px, env(safe-area-inset-right));
  bottom: max(24px, env(safe-area-inset-bottom));
  z-index: 40;
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border: 1px solid $color-line;
  border-radius: 50%;
  background: rgba($color-panel, 0.85);
  backdrop-filter: blur(12px);
  transition: border-color $transition, box-shadow $transition;

  &:hover {
    border-color: $color-led;
    box-shadow: 0 0 28px $color-led-glow;
  }

  &__ring {
    position: absolute;
    inset: 0;
    transform: rotate(-90deg);
  }

  &__track,
  &__progress {
    fill: none;
    stroke-width: 2;
  }

  &__track {
    stroke: $color-line;
  }

  &__progress {
    stroke: $color-led;
    stroke-linecap: round;
    filter: drop-shadow(0 0 4px $color-led-glow);
    transition: stroke-dashoffset 0.15s linear;
  }

  &__arrow {
    font-family: $font-mono;
    font-size: 1.1rem;
    color: $color-text;
    transition: transform $transition, color $transition;
  }

  &:hover &__arrow {
    color: $color-led;
    transform: translateY(-3px);
  }
}

.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.35s $ease-out, transform 0.35s $ease-out;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.9);
}
</style>
