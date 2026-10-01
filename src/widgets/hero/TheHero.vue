<script setup lang="ts">
const { title, currentJob, lines, isTracking, letterStyle, stack, trackCta } = useHero()
</script>

<template>
  <section
    id="top"
    class="hero"
  >
    <div class="hero__inner">
      <p class="hero__eyebrow">
        <span
          class="hero__status-led"
          aria-hidden="true"
        />
        {{ $t('hero.status') }}
        <span
          class="hero__divider"
          aria-hidden="true"
        >/</span>
        {{ $t('hero.eyebrow') }}
      </p>

      <h1
        ref="title"
        class="hero__name"
        :class="{ 'hero__name--tracking': isTracking }"
        :aria-label="`${$t('hero.first-name')} ${$t('hero.last-name')}`"
      >
        <span
          v-for="(line, lineIndex) in lines"
          :key="line.id"
          class="hero__line"
          aria-hidden="true"
        >
          <span
            v-for="(letter, letterIndex) in line.letters"
            :key="letter.id"
            class="hero__letter"
            :style="{ '--i': letterIndex + lineIndex * 7 }"
          ><span
            class="hero__glyph"
            :style="letterStyle(lineIndex, letter.position)"
          >{{ letter.char }}</span></span>
        </span>
      </h1>

      <div class="hero__meta">
        <dl class="hero__facts">
          <div class="hero__fact">
            <dt>{{ $t('hero.role-label') }}</dt>
            <dd class="hero__role">
              {{ $t('hero.role') }}
              <span
                v-if="currentJob"
                class="hero__job"
                :class="`hero__job--${currentJob.id}`"
              >
                <span
                  class="hero__at"
                  aria-hidden="true"
                >@</span>
                <component
                  :is="currentJob.url ? 'a' : 'span'"
                  class="hero__company"
                  :href="currentJob.url ?? undefined"
                  :target="currentJob.url ? '_blank' : undefined"
                  :rel="currentJob.url ? 'noopener noreferrer' : undefined"
                  aria-describedby="hero-job-tooltip"
                >
                  <img
                    class="hero__company-logo"
                    :src="currentJob.logo"
                    alt=""
                    width="20"
                    height="20"
                  >
                  {{ currentJob.company }}
                </component>
                <span
                  id="hero-job-tooltip"
                  role="tooltip"
                  class="hero__tooltip"
                >
                  <span class="hero__tooltip-title">
                    <span
                      class="hero__tooltip-led"
                      aria-hidden="true"
                    />
                    {{ $t('hero.job.title') }}
                  </span>
                  <span>{{ $t('hero.job.since', { date: currentJob.since }) }}</span>
                  <span v-if="currentJob.project">{{ $t('hero.job.project', { name: currentJob.project }) }}</span>
                </span>
              </span>
            </dd>
          </div>
          <div class="hero__fact">
            <dt>{{ $t('hero.location-label') }}</dt>
            <dd>{{ $t('hero.location') }}</dd>
          </div>
        </dl>

        <p class="hero__lead">
          {{ $t('hero.lead') }}
        </p>

        <div class="hero__actions">
          <CvDownload class="hero__cv-download" />
          <div class="hero__actions-row">
            <a
              v-magnetic
              href="#board"
              class="hero__cta"
              @click="trackCta('board')"
            >
              {{ $t('hero.cta-board') }}
              <span aria-hidden="true">↓</span>
            </a>
            <a
              v-magnetic
              href="#contact"
              class="hero__cta"
              @click="trackCta('contact')"
            >
              {{ $t('hero.cta-contact') }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div
      class="hero__marquee"
      aria-hidden="true"
    >
      <div class="hero__marquee-track">
        <span
          v-for="(item, index) in stack"
          :key="`${item}-${index}`"
          class="hero__marquee-item"
        >{{ item }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100svh;
  padding-top: 120px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 70vmax;
    height: 70vmax;
    border-radius: 50%;
    background: radial-gradient(circle, $color-led-dim 0%, transparent 60%);
    pointer-events: none;
  }

  &__inner {
    position: relative;
    padding-bottom: clamp(40px, 6vw, 80px);

    @include container;
  }

  &__eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: clamp(24px, 4vw, 48px);
    animation: hero-rise 1s $ease-out both;

    @include label;
  }

  &__cv-download {
    @include respond-min($bp-md) {
      width: 100%;
    }
  }

  &__status-led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $color-ok;
    box-shadow: 0 0 12px $color-ok;
    animation: led-blink 1.6s ease-in-out infinite;
  }

  &__divider {
    color: $color-faint;
  }

  &__name {
    display: flex;
    flex-direction: column;
    font-family: $font-display;
    font-size: clamp(3.4rem, 13vw, 12.5rem);
    font-weight: 700;
    line-height: 0.92;
    letter-spacing: -0.015em;
    text-transform: uppercase;
    cursor: default;
    user-select: none;
  }

  &__line {
    display: block;
    white-space: nowrap;

    &:last-child {
      padding-left: 0.6em;
      color: $color-led;
      text-shadow: 0 0 60px $color-led-glow;

      @include respond($bp-md) {
        padding-left: 0;
      }
    }
  }

  &__letter {
    display: inline-block;
    animation: hero-letter 1.1s $ease-out both;
    animation-delay: calc(var(--i) * 45ms);
  }

  &__glyph {
    display: inline-block;
    font-variation-settings: 'wght' 700;
    animation: hero-breathe 6s ease-in-out infinite;
    animation-delay: calc(1.2s + var(--i) * 120ms);
    transition: font-variation-settings 0.25s $ease-out;
  }

  &__name--tracking &__glyph {
    animation: none;
  }

  &__meta {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) minmax(0, 1.4fr) auto;
    align-items: end;
    gap: 32px 48px;
    margin-top: clamp(40px, 6vw, 72px);
    padding-top: 28px;
    border-top: 1px solid $color-line;
    animation: hero-rise 1s $ease-out 0.6s both;

    @include respond($bp-lg) {
      grid-template-columns: 1fr;
    }
  }

  &__facts {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__fact {
    dt {
      margin-bottom: 4px;

      @include label;

      color: $color-faint;
    }

    dd {
      font-size: 1rem;
      font-weight: 500;
    }
  }

  &__role {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  &__job {
    --brand: #{$color-led};

    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    @each $id, $color in $brand-colors {
      &--#{$id} {
        --brand: #{$color};
      }
    }
  }

  &__at {
    color: $color-faint;
  }

  &__company {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 14px 4px 4px;
    border: 1px solid $color-line-high;
    border-radius: 999px;
    background: $color-panel;
    transition: border-color $transition, background $transition, box-shadow $transition;
  }

  &__company-logo {
    width: 24px;
    height: 24px;
    padding: 2px;
    border-radius: 50%;
    background: $color-ink;
  }

  &__job:hover &__company,
  &__job:focus-within &__company {
    border-color: color-mix(in srgb, var(--brand) 60%, transparent);
    background: color-mix(in srgb, var(--brand) 12%, $color-panel);
    box-shadow: 0 0 24px color-mix(in srgb, var(--brand) 30%, transparent);
  }

  &__tooltip {
    position: absolute;
    bottom: calc(100% + 12px);
    left: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: max-content;
    max-width: 280px;
    padding: 12px 14px;
    border: 1px solid $color-line-high;
    border-radius: $radius-md;
    background: $color-panel-high;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    font-size: 0.8rem;
    font-weight: 400;
    line-height: 1.45;
    color: $color-muted;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.25s $ease-out, transform 0.25s $ease-out;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 40px;
      border: 6px solid transparent;
      border-top-color: $color-line-high;
    }
  }

  &__job:hover &__tooltip,
  &__job:focus-within &__tooltip {
    opacity: 1;
    transform: none;
  }

  &__tooltip-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: $color-text;
  }

  &__tooltip-led {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: $color-ok;
    box-shadow: 0 0 8px $color-ok;
  }

  &__lead {
    max-width: 52ch;
    font-size: clamp(1rem, 1.4vw, 1.15rem);
    line-height: 1.6;
    color: $color-muted;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  &__actions-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 24px;
    border: 1px solid $color-line-high;
    border-radius: 999px;
    font-family: $font-mono;
    font-size: 0.85rem;
    white-space: nowrap;
    transition: background $transition, color $transition, border-color $transition, box-shadow $transition;

    &:hover {
      border-color: $color-text;
    }
  }

  &__marquee {
    position: relative;
    overflow: hidden;
    padding-block: 18px;
    border-block: 1px solid $color-line;
    background: $color-panel;
    mask-image: linear-gradient(90deg, transparent, $color-ink 10%, $color-ink 90%, transparent);
  }

  &__marquee-track {
    display: flex;
    width: max-content;
    animation: marquee 40s linear infinite;
  }

  &__marquee-item {
    display: flex;
    align-items: center;
    gap: 28px;
    padding-right: 28px;
    font-family: $font-mono;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $color-muted;

    &::after {
      content: '';

      @include led(5px);
    }
  }
}

@keyframes hero-letter {
  from {
    opacity: 0;
    transform: translateY(0.4em) rotate(4deg);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

@keyframes hero-breathe {
  0%, 100% { font-variation-settings: 'wght' 700; }
  50% { font-variation-settings: 'wght' 300; }
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
