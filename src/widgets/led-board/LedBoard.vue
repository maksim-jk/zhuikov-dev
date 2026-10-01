<script setup lang="ts">
const { cellCount, placeholderStyle } = useLedBoardSection()
</script>

<template>
  <section
    id="board"
    class="led-board"
  >
    <SectionHeading
      :index="$t('led.index')"
      :title="$t('led.title')"
      :subtitle="$t('led.subtitle', { count: cellCount })"
    />

    <div
      v-reveal
      class="led-board__device"
    >
      <div class="led-board__chassis">
        <span
          class="led-board__screw"
          aria-hidden="true"
        />
        <span class="led-board__model">{{ $t('led.device') }}</span>
        <span class="led-board__grid-size">128 × 72</span>
        <span
          class="led-board__screw"
          aria-hidden="true"
        />
      </div>

      <ClientOnly>
        <LedBoardCanvas />
        <LedBoardToolbar />
        <template #fallback>
          <div
            class="led-board__placeholder"
            :style="placeholderStyle"
          />
          <div class="led-board__toolbar-placeholder" />
        </template>
      </ClientOnly>
    </div>

    <p class="led-board__mobile-hint">
      {{ $t('led.mobile-hint') }}
    </p>
  </section>
</template>

<style lang="scss" scoped>
.led-board {
  padding-block: clamp(80px, 12vw, 160px) 0;

  &__device {
    overflow: hidden;
    border-block: 1px solid $color-line;
    background: $color-panel;
    box-shadow: 0 40px 120px -40px $color-led-dim;
  }

  &__chassis {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px $container-px;
    border-bottom: 1px solid $color-line;

    @include label;
  }

  &__model {
    color: $color-text;
  }

  &__grid-size {
    margin-left: auto;
  }

  &__screw {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid $color-line-high;
    background: linear-gradient(135deg, $color-panel-high 45%, $color-line-high 50%, $color-panel-high 55%);
  }

  &__placeholder {
    width: 100%;
    min-width: calc(128 * 8px);
    background-color: $color-panel;
    background-image: radial-gradient(circle, $color-line 22%, transparent 24%);
    background-size: calc(100% / 128) calc(100% / 72);
  }

  &__toolbar-placeholder {
    height: 69px;
    border-top: 1px solid $color-line;
  }

  &__mobile-hint {
    display: none;
    padding: 12px $container-px 0;

    @include label;

    @include respond($bp-lg) {
      display: block;
    }
  }
}
</style>
