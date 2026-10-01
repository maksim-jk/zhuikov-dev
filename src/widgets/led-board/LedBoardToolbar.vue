<script setup lang="ts">
const {
  tools,
  tool,
  isLifeRunning,
  litLabel,
  copied,
  downloadLink,
  downloadUrl,
  setTool,
  clear,
  invert,
  reset,
  toggleLife,
  share,
  exportPng,
} = useLedBoardToolbar()
</script>

<template>
  <div
    class="led-toolbar"
    role="toolbar"
    :aria-label="$t('led.tools-label')"
  >
    <div class="led-toolbar__group led-toolbar__group--segmented">
      <button
        v-for="option in tools"
        :key="option.id"
        type="button"
        class="led-toolbar__button"
        :class="{ 'led-toolbar__button--active': tool === option.id }"
        :aria-pressed="tool === option.id"
        @click="setTool(option.id)"
      >
        <span
          class="led-toolbar__icon"
          aria-hidden="true"
        >{{ option.icon }}</span>
        {{ $t(option.labelKey) }}
      </button>
    </div>

    <div class="led-toolbar__group">
      <button
        type="button"
        class="led-toolbar__button"
        @click="clear"
      >
        {{ $t('led.tools.clear') }}
      </button>
      <button
        type="button"
        class="led-toolbar__button"
        @click="invert"
      >
        {{ $t('led.tools.invert') }}
      </button>
      <button
        type="button"
        class="led-toolbar__button"
        @click="reset"
      >
        {{ $t('led.tools.reset') }}
      </button>
      <button
        type="button"
        class="led-toolbar__button"
        :class="{ 'led-toolbar__button--active': isLifeRunning }"
        :aria-pressed="isLifeRunning"
        @click="toggleLife"
      >
        <span
          class="led-toolbar__icon"
          aria-hidden="true"
        >{{ isLifeRunning ? '❚❚' : '▶' }}</span>
        {{ isLifeRunning ? $t('led.tools.pause') : $t('led.tools.life') }}
      </button>
    </div>

    <div class="led-toolbar__group">
      <button
        type="button"
        class="led-toolbar__button"
        @click="exportPng"
      >
        ↓ {{ $t('led.tools.export') }}
      </button>
      <button
        type="button"
        class="led-toolbar__button"
        @click="share"
      >
        {{ copied ? `✓ ${$t('led.tools.copied')}` : `⌘ ${$t('led.tools.share')}` }}
      </button>
      <a
        v-if="downloadUrl"
        ref="downloadLink"
        :href="downloadUrl"
        download="maksim-zhuikov-led.png"
        hidden
      />
    </div>

    <p class="led-toolbar__counter">
      <span
        class="led-toolbar__led"
        aria-hidden="true"
      />
      {{ litLabel }} {{ $t('led.lit') }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.led-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 16px $container-px;
  border-top: 1px solid $color-line;
  background: $color-panel;

  &__group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    &--segmented {
      padding: 4px;
      border: 1px solid $color-line;
      border-radius: $radius-md;
      background: $color-ink;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid $color-line;
    border-radius: $radius-sm;
    font-family: $font-mono;
    font-size: 0.8rem;
    color: $color-muted;
    background: $color-panel-high;
    transition: color $transition, border-color $transition, background $transition, box-shadow $transition;

    &:hover {
      color: $color-text;
      border-color: $color-line-high;
    }

    &:active {
      transform: translateY(1px);
    }

    &--active {
      color: $color-ink;
      border-color: $color-led;
      background: $color-led;
      box-shadow: 0 0 18px $color-led-glow;

      &:hover {
        color: $color-ink;
        border-color: $color-led;
      }
    }
  }

  &__group--segmented &__button {
    border-color: transparent;
    background: transparent;

    &--active {
      border-color: $color-led;
      background: $color-led;
    }
  }

  &__icon {
    font-size: 0.7rem;
  }

  &__counter {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    font-family: $font-mono;
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
    color: $color-muted;
  }

  &__led {
    @include led(8px);

    animation: led-blink 2.4s ease-in-out infinite;
  }
}
</style>
