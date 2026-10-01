<script setup lang="ts">
const { navItems, cvSize, isScrolled, isEnglish, nextLocalePath } = useHeader()
</script>

<template>
  <header
    class="header"
    :class="{ 'header--scrolled': isScrolled }"
  >
    <a
      href="#top"
      class="header__logo"
      aria-label="Maksim Zhuikov"
    >
      <span
        class="header__logo-led"
        aria-hidden="true"
      />
      MZ
    </a>

    <nav class="header__nav">
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="`#${item.id}`"
        class="header__link"
      >
        {{ $t(item.labelKey) }}
      </a>
    </nav>

    <CvDownload
      class="header__cv"
      :size="cvSize"
    />

    <NuxtLink
      :to="nextLocalePath"
      class="header__lang"
      :aria-label="$t('nav.lang-switch')"
    >
      <span
        class="header__lang-label"
        :class="{ 'header__lang-label--active': !isEnglish }"
      >RU</span>
      <span
        class="header__switch"
        :class="{ 'header__switch--on': isEnglish }"
        aria-hidden="true"
      >
        <span class="header__switch-knob" />
      </span>
      <span
        class="header__lang-label"
        :class="{ 'header__lang-label--active': isEnglish }"
      >EN</span>
    </NuxtLink>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px $container-px;

  @include respond($bp-lg) {
    gap: 16px;
  }
  border-bottom: 1px solid transparent;
  transition: padding $transition, background $transition, border-color $transition, backdrop-filter $transition;

  &--scrolled {
    padding-block: 12px;
    border-color: $color-line;
    background: rgba($color-ink, 0.72);
    backdrop-filter: blur(14px);
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: $font-display;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  &__logo-led {
    @include led(8px);

    animation: led-blink 3s ease-in-out infinite;
  }

  &__nav {
    display: flex;
    gap: 4px;
    margin-inline: auto;

    @include respond($bp-md) {
      display: none;
    }
  }

  &__link {
    padding: 8px 14px;
    border-radius: $radius-sm;
    font-family: $font-mono;
    font-size: 0.8rem;
    white-space: nowrap;
    color: $color-muted;
    transition: color $transition, background $transition;

    @include respond($bp-lg) {
      padding-inline: 8px;
    }

    &:hover {
      color: $color-text;
      background: $color-panel-high;
    }
  }

  &__cv {
    margin-left: auto;

    @include respond-min($bp-md) {
      margin-left: 0;
    }

    @include respond($bp-sm) {
      display: none;
    }
  }

  &__lang {
    display: flex;
    align-items: center;
    gap: 10px;

    @include respond($bp-sm) {
      margin-left: auto;
    }
    font-family: $font-mono;
    font-size: 0.75rem;
  }

  &__lang-label {
    color: $color-faint;
    transition: color $transition;

    &--active {
      color: $color-text;
    }
  }

  &__switch {
    position: relative;
    width: 40px;
    height: 22px;
    border: 1px solid $color-line-high;
    border-radius: 11px;
    background: $color-panel;
    transition: background $transition, border-color $transition;

    &--on {
      border-color: $color-led;
      background: $color-led-dim;
    }
  }

  &__switch-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: $color-muted;
    transition: transform $transition, background $transition, box-shadow $transition;
  }

  &__switch--on &__switch-knob {
    transform: translateX(18px);
    background: $color-led;
    box-shadow: 0 0 10px $color-led-glow;
  }
}
</style>
