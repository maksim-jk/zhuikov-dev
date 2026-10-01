<script setup lang="ts">
import { CvDownloadSize } from './cv-download.types'

withDefaults(defineProps<{
  size?: CvDownloadSize
}>(), {
  size: CvDownloadSize.MD,
})

const { files, selected, selectedIndex, downloadLabel, isSelected, select } = useCvDownload()
</script>

<template>
  <div
    class="cv"
    :class="`cv--${size}`"
  >
    <a
      class="cv__download"
      :href="selected.href"
      :hreflang="selected.lang"
      :aria-label="downloadLabel"
      :title="downloadLabel"
      type="application/pdf"
      download
    >
      <svg
        class="cv__icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M8 2.5v7m0 0L5 6.5m3 3 3-3M3 11.5v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1" />
      </svg>
      <span class="cv__text">{{ size === CvDownloadSize.SM ? $t('cv.short') : $t('cv.title') }}</span>
      <span
        v-if="size === CvDownloadSize.MD"
        class="cv__meta"
        aria-hidden="true"
      >PDF</span>
    </a>

    <span
      class="cv__langs"
      role="radiogroup"
      :aria-label="$t('cv.lang-label')"
      :style="{ '--index': selectedIndex }"
    >
      <span
        class="cv__thumb"
        aria-hidden="true"
      />
      <button
        v-for="file in files"
        :key="file.lang"
        type="button"
        role="radio"
        class="cv__lang"
        :class="{ 'cv__lang--active': isSelected(file.lang) }"
        :aria-checked="isSelected(file.lang)"
        @click="select(file.lang)"
      >
        {{ file.label }}
      </button>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.cv {
  --pad: 4px;
  --lang-width: 42px;

  display: inline-flex;
  align-items: stretch;
  gap: 4px;
  padding: var(--pad);
  border: 1px solid $color-line-high;
  border-radius: 999px;
  background: $color-panel;
  font-family: $font-mono;
  font-size: 0.85rem;
  white-space: nowrap;

  &__download {
    width: stretch;
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
    padding: 12px 20px 12px 16px;
    border-radius: 999px;
    background: $color-led;
    color: $color-ink;
    box-shadow: 0 0 28px $color-led-glow;
    transition: background $transition, box-shadow $transition;

    &:hover {
      background: $color-led-hot;
      box-shadow: 0 0 36px $color-led-glow;
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: translate $transition;
  }

  &__download:hover &__icon {
    translate: 0 2px;
  }

  &__text {
    font-weight: 500;
  }

  &__meta {
    padding: 2px 6px;
    border: 1px solid rgba($color-ink, 0.3);
    border-radius: 4px;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    opacity: 0.7;
  }

  &__langs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, var(--lang-width));
    padding: 3px;
    border-radius: 999px;
    background: $color-ink;
  }

  &__thumb {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    width: var(--lang-width);
    border: 1px solid $color-line-high;
    border-radius: 999px;
    background: $color-panel-high;
    transform: translateX(calc(var(--index) * 100%));
    transition: transform $transition;
  }

  &__lang {
    position: relative;
    border-radius: 999px;
    font-family: inherit;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    color: $color-faint;
    transition: color $transition;

    &:hover {
      color: $color-muted;
    }

    &--active,
    &--active:hover {
      color: $color-text;
    }
  }

  &--sm {
    --pad: 3px;
    --lang-width: 32px;

    gap: 3px;
    font-size: 0.72rem;

    .cv__download {
      gap: 6px;
      padding: 6px 12px 6px 10px;
      box-shadow: 0 0 16px $color-led-glow;
    }

    .cv__icon {
      width: 13px;
      height: 13px;
    }

    .cv__langs {
      padding: 2px;
    }

    .cv__thumb {
      top: 2px;
      bottom: 2px;
      left: 2px;
    }

    .cv__lang {
      font-size: 0.65rem;
    }
  }
}
</style>
