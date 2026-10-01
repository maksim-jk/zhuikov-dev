<script setup lang="ts">
const { entries, getHost, getPrimaryClient, getPoints, isOpen, toggle } = useExperience()
</script>

<template>
  <section
    id="experience"
    class="experience"
  >
    <SectionHeading
      :index="$t('experience.index')"
      :title="$t('experience.title')"
    />

    <ol class="experience__list">
      <li
        v-for="(entry, index) in entries"
        :key="entry.id"
        v-reveal="index * 0.06"
        class="experience__item"
        :class="[`experience__item--${entry.id}`, { 'experience__item--open': isOpen(entry.id), 'experience__item--current': entry.isCurrent }]"
      >
        <button
          type="button"
          class="experience__head"
          :aria-expanded="isOpen(entry.id)"
          :aria-controls="`experience-${entry.id}`"
          @click="toggle(entry.id)"
        >
          <span
            class="experience__logo"
            aria-hidden="true"
          >
            <img
              class="experience__logo-mark"
              :src="entry.logo"
              alt=""
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
            >
            <span class="experience__led" />
            <img
              v-if="getPrimaryClient(entry.clients)"
              class="experience__client-badge"
              :src="getPrimaryClient(entry.clients)?.logo"
              alt=""
              width="24"
              height="24"
              loading="lazy"
              decoding="async"
            >
          </span>
          <span class="experience__period">
            {{ entry.period }}
            <span class="experience__duration">{{ entry.duration }}</span>
          </span>
          <span class="experience__company">
            {{ entry.company }}
            <span
              v-if="getPrimaryClient(entry.clients)"
              class="experience__client"
            >{{ $t('experience.project') }} — {{ getPrimaryClient(entry.clients)?.name }}</span>
            <span
              v-else-if="entry.clients.length"
              class="experience__client"
            >
              {{ $t('experience.projects') }} —
              <span
                v-for="(client, clientIndex) in entry.clients"
                :key="client.id"
              >{{ clientIndex ? ' · ' : '' }}{{ client.name }}</span>
            </span>
          </span>
          <span class="experience__role">{{ $t(`experience.items.${entry.id}.role`) }}</span>
          <span
            class="experience__toggle"
            aria-hidden="true"
          >
            <span class="experience__toggle-lever" />
          </span>
        </button>

        <div
          :id="`experience-${entry.id}`"
          class="experience__panel"
          :inert="!isOpen(entry.id)"
        >
          <div class="experience__panel-inner">
            <img
              class="experience__watermark"
              :src="entry.logo"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            >
            <div class="experience__details">
              <p class="experience__about">
                {{ $t(`experience.items.${entry.id}.about`) }}
              </p>
              <p class="experience__tags">
                <span>{{ $t(`experience.${entry.employment}`) }}</span>
                <span>{{ $t(`experience.${entry.mode}`) }}</span>
                <span v-if="entry.location">{{ entry.location }}</span>
              </p>
              <ul
                v-if="entry.url || entry.clients.length"
                class="experience__links"
              >
                <li v-if="entry.url">
                  <a
                    class="experience__link"
                    :href="entry.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      class="experience__link-logo"
                      :src="entry.logo"
                      alt=""
                      width="20"
                      height="20"
                    >
                    <span class="experience__link-text">
                      <span class="experience__link-label">{{ $t('experience.website') }}</span>
                      {{ getHost(entry.url) }}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
                <li
                  v-for="client in entry.clients"
                  :key="client.id"
                >
                  <a
                    :class="['experience__link', `experience__link--${client.id}`]"
                    :href="client.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      class="experience__link-logo"
                      :src="client.logo"
                      alt=""
                      width="20"
                      height="20"
                    >
                    <span class="experience__link-text">
                      <span class="experience__link-label">{{ $t('experience.project') }}</span>
                      {{ client.name }} · {{ getHost(client.url) }}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
              <ul class="experience__points">
                <li
                  v-for="point in getPoints(entry.id)"
                  :key="point"
                  class="experience__point"
                >
                  {{ point }}
                </li>
              </ul>
              <ul class="experience__stack">
                <li
                  v-for="tech in entry.stack"
                  :key="tech"
                  class="experience__chip"
                >
                  {{ tech }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style lang="scss" scoped>
.experience {
  padding-block: clamp(100px, 14vw, 180px) 0;

  &__list {
    @include container;
  }

  &__item {
    --brand: #{$color-led};

    border-top: 1px solid $color-line;

    &:last-child {
      border-bottom: 1px solid $color-line;
    }

    @each $id, $color in $brand-colors {
      &--#{$id} {
        --brand: #{$color};
      }
    }
  }

  &__head {
    display: grid;
    grid-template-columns: 56px minmax(160px, 1fr) minmax(0, 1.4fr) minmax(0, 1fr) 40px;
    align-items: center;
    gap: 24px;
    width: 100%;
    padding: 24px 0;
    text-align: left;
    transition: padding $transition;

    @include respond($bp-md) {
      grid-template-columns: 48px 1fr 40px;
      gap: 6px 16px;
    }

    &:hover {
      padding-inline: 12px;
    }
  }

  &__logo {
    position: relative;
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border: 1px solid $color-line-high;
    border-radius: $radius-md;
    background: $color-panel;
    transition: border-color $transition, background $transition, box-shadow $transition;

    @include respond($bp-md) {
      grid-row: span 3;
      align-self: start;
      width: 48px;
      height: 48px;
    }
  }

  &__logo-mark {
    width: 60%;
    height: 60%;
    object-fit: contain;
    opacity: 0.5;
    filter: grayscale(1);
    transition: opacity $transition, filter $transition, transform $transition;
  }

  &__head:hover &__logo,
  &__item--open &__logo {
    border-color: color-mix(in srgb, var(--brand) 55%, transparent);
    background: color-mix(in srgb, var(--brand) 10%, $color-panel);
    box-shadow: 0 0 28px color-mix(in srgb, var(--brand) 30%, transparent);
  }

  &__head:hover &__logo-mark,
  &__item--open &__logo-mark {
    opacity: 1;
    filter: none;
    transform: scale(1.06);
  }

  &__led {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 10px;
    height: 10px;
    border: 2px solid $color-ink;
    border-radius: 50%;
    background: $color-line-high;
    box-sizing: content-box;
    transition: background $transition, box-shadow $transition;
  }

  &__head:hover &__led,
  &__item--open &__led {
    background: $color-led;
    box-shadow: 0 0 14px $color-led-glow;
  }

  &__item--current &__led {
    animation: led-blink 2s ease-in-out infinite;
  }

  &__period {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: $font-mono;
    font-size: 0.8rem;
    color: $color-muted;

    @include respond($bp-md) {
      grid-column: 2;
    }
  }

  &__duration {
    color: $color-faint;
  }

  &__client-badge {
    position: absolute;
    right: -8px;
    bottom: -8px;
    width: 26px;
    height: 26px;
    padding: 4px;
    border: 2px solid $color-ink;
    border-radius: $radius-sm;
    background: $color-panel-high;
    box-sizing: border-box;
    opacity: 0.6;
    filter: grayscale(1);
    transition: opacity $transition, filter $transition;
  }

  &__head:hover &__client-badge,
  &__item--open &__client-badge {
    opacity: 1;
    filter: none;
  }

  &__client {
    min-width: 0;
    max-width: 100%;
    font-family: $font-mono;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.45;
    letter-spacing: 0.04em;
    color: $color-muted;
  }

  &__company {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: $font-display;
    font-size: clamp(1.6rem, 3.4vw, 2.8rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    transition: color $transition;

    @include respond($bp-md) {
      grid-column: 2;
    }
  }

  &__head:hover &__company,
  &__item--open &__company {
    color: $color-led;
  }

  &__role {
    color: $color-muted;

    @include respond($bp-md) {
      grid-column: 2;
    }
  }

  &__toggle {
    position: relative;
    justify-self: end;
    width: 22px;
    height: 34px;
    border: 1px solid $color-line-high;
    border-radius: 6px;
    background: $color-ink;

    @include respond($bp-md) {
      grid-column: 3;
      grid-row: 1 / span 3;
    }
  }

  &__toggle-lever {
    position: absolute;
    left: 50%;
    bottom: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $color-muted;
    transform: translateX(-50%);
    transition: bottom $transition, background $transition, box-shadow $transition;
  }

  &__item--open &__toggle-lever {
    bottom: 18px;
    background: $color-led;
    box-shadow: 0 0 10px $color-led-glow;
  }

  &__panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.5s $ease-out;
  }

  &__item--open &__panel {
    grid-template-rows: 1fr;
  }

  &__panel-inner {
    position: relative;
    overflow: hidden;
  }

  &__watermark {
    position: absolute;
    top: 0;
    right: 0;
    width: clamp(140px, 18vw, 240px);
    height: clamp(140px, 18vw, 240px);
    object-fit: contain;
    opacity: 0;
    transform: rotate(-10deg) scale(0.85);
    transition: opacity 0.6s $ease-out, transform 0.8s $ease-out;
    pointer-events: none;

    @include respond($bp-lg) {
      display: none;
    }
  }

  &__item--open &__watermark {
    opacity: 0.08;
    transform: rotate(-10deg) scale(1);
  }

  &__details {
    position: relative;
    display: grid;
    gap: 20px;
    max-width: 820px;
    margin-left: calc(56px + 24px + max(160px, 20%));
    padding-bottom: 36px;
    opacity: 0;
    transform: translateY(-8px);
    transition: opacity 0.4s $ease-out, transform 0.4s $ease-out;

    @include respond($bp-lg) {
      margin-left: 80px;
    }

    @include respond($bp-md) {
      margin-left: 64px;
    }
  }

  &__item--open &__details {
    opacity: 1;
    transform: none;
    transition-delay: 0.1s;
  }

  &__about {
    font-size: 1.05rem;
    line-height: 1.6;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;

    @include label;
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px 10px 10px;
    border: 1px solid $color-line-high;
    border-radius: $radius-md;
    background: $color-panel;
    font-size: 0.9rem;
    transition: border-color $transition, background $transition;

    @each $id, $color in $brand-colors {
      &--#{$id} {
        --brand: #{$color};
      }
    }

    &:hover {
      border-color: color-mix(in srgb, var(--brand) 60%, transparent);
      background: color-mix(in srgb, var(--brand) 8%, $color-panel);
    }
  }

  &__link-logo {
    width: 28px;
    height: 28px;
    padding: 4px;
    border-radius: $radius-sm;
    background: $color-ink;
    object-fit: contain;
  }

  &__link-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__link-label {
    font-family: $font-mono;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $color-faint;
  }

  &__points {
    display: grid;
    gap: 10px;
  }

  &__point {
    position: relative;
    padding-left: 22px;
    line-height: 1.55;
    color: $color-muted;

    &::before {
      content: '';
      position: absolute;
      top: 0.6em;
      left: 0;
      width: 10px;
      height: 1px;
      background: $color-led;
    }
  }

  &__stack {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__chip {
    padding: 6px 12px;
    border: 1px solid $color-line-high;
    border-radius: 999px;
    font-family: $font-mono;
    font-size: 0.75rem;
    color: $color-text;
  }
}
</style>
