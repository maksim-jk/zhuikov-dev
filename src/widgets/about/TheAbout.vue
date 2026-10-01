<script setup lang="ts">
const { stats, counters, certificates, getHost, opened, openCertificate, closeCertificate } = useAbout()
</script>

<template>
  <section
    id="about"
    class="about"
  >
    <SectionHeading
      :index="$t('about.index')"
      :title="$t('about.title')"
    />

    <div class="about__body">
      <p
        v-reveal
        class="about__text"
      >
        {{ $t('about.text') }}
      </p>

      <ul
        ref="stats"
        class="about__stats"
      >
        <li
          v-for="(stat, index) in counters"
          :key="stat.id"
          v-reveal="index * 0.08"
          class="about__stat"
        >
          <span class="about__stat-value">{{ stat.display }}</span>
          <span class="about__stat-label">{{ $t(`about.stats.${stat.id}`) }}</span>
        </li>
      </ul>

      <div
        v-reveal
        class="about__certs"
      >
        <span class="about__certs-title">{{ $t('about.certificates-title') }}</span>
        <ul class="about__certs-list">
          <li
            v-for="item in certificates"
            :key="item.id"
            class="about__cert"
          >
            <button
              type="button"
              class="about__cert-open"
              @click="openCertificate(item.id)"
            >
              <img
                class="about__cert-image"
                :src="item.image"
                alt=""
                width="320"
                height="180"
                loading="lazy"
                decoding="async"
              >
              <span class="about__cert-body">
                <span class="about__cert-date">{{ $t(`about.certificates.${item.id}.date`) }}</span>
                <span class="about__cert-title">{{ $t(`about.certificates.${item.id}.title`) }}</span>
                <span class="about__cert-view">{{ $t('about.certificates.view') }}</span>
              </span>
            </button>
            <ul class="about__issuers">
              <li
                v-for="issuer in item.issuers"
                :key="issuer.id"
              >
                <a
                  class="about__issuer"
                  :class="`about__issuer--${issuer.id}`"
                  :href="issuer.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    class="about__issuer-logo"
                    :src="issuer.logo"
                    alt=""
                    width="20"
                    height="20"
                  >
                  <span class="about__issuer-text">
                    <span class="about__issuer-label">{{ $t('about.certificates.website') }}</span>
                    {{ getHost(issuer.url) }}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="about-viewer">
        <div
          v-if="opened"
          class="about-viewer"
          role="dialog"
          aria-modal="true"
          :aria-label="$t(`about.certificates.${opened.id}.title`)"
          @click="closeCertificate"
        >
          <button
            type="button"
            class="about-viewer__close"
            :aria-label="$t('about.certificates.close')"
            @click="closeCertificate"
          >
            ×
          </button>
          <figure
            class="about-viewer__frame"
            @click.stop
          >
            <img
              class="about-viewer__image"
              :src="opened.image"
              :alt="$t(`about.certificates.${opened.id}.title`)"
            >
            <figcaption class="about-viewer__caption">
              <span class="about-viewer__title">{{ $t(`about.certificates.${opened.id}.title`) }}</span>
              <span>{{ $t(`about.certificates.${opened.id}.about`) }}</span>
            </figcaption>
          </figure>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style lang="scss" scoped>
.about {
  padding-block: clamp(100px, 14vw, 180px) 0;

  &__body {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 56px 24px;

    @include container;

    @include respond($bp-md) {
      grid-template-columns: 1fr;
    }

    > * {
      grid-column: 2;

      @include respond($bp-md) {
        grid-column: 1;
      }
    }
  }

  &__text {
    max-width: 38ch;
    font-size: clamp(1.4rem, 2.6vw, 2.4rem);
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.025em;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid $color-line;
    border-radius: $radius-lg;
    background: $color-panel;
    overflow: hidden;

    @include respond($bp-lg) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__stat {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 28px;
    border-right: 1px solid $color-line;
    transition: background $transition;

    &:last-child {
      border-right: none;
    }

    @include respond($bp-lg) {
      &:nth-child(2n) {
        border-right: none;
      }

      &:nth-child(-n + 2) {
        border-bottom: 1px solid $color-line;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 20px;
      right: 20px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $color-line-high;
      transition: background $transition, box-shadow $transition;
    }

    &:hover {
      background: $color-panel-high;

      &::before {
        background: $color-led;
        box-shadow: 0 0 10px $color-led-glow;
      }
    }
  }

  &__stat-value {
    font-family: $font-display;
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.04em;
    color: $color-led;
    text-shadow: 0 0 30px $color-led-glow;
  }

  &__stat-label {
    font-size: 0.9rem;
    line-height: 1.4;
    color: $color-muted;
  }

  &__certs {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  &__certs-title {
    @include label;
  }

  &__certs-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 320px));
    justify-content: start;
    gap: 12px;
    width: 100%;

    @include respond($bp-sm) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__cert {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel;
  }

  &__cert-open {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
  }

  &__cert-image {
    height: 112px;
    width: 100%;
    object-fit: cover;
    object-position: top;
    background: $color-ink;
    transition: filter $transition;
  }

  &__cert-open:hover &__cert-image {
    filter: brightness(1.08);
  }

  &__cert-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 14px 10px;
  }

  &__cert-date {
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $color-led;
  }

  &__cert-title {
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.35;
  }

  &__cert-view {
    margin-top: 4px;
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $color-faint;
    transition: color $transition;
  }

  &__cert-open:hover &__cert-view {
    color: $color-led;
  }

  &__issuers {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0 14px 14px;
  }

  &__issuer {
    --brand: #{$color-led};

    display: inline-flex;
    align-items: center;
    gap: 12px;
    max-width: 100%;
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

  &__issuer-logo {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    padding: 4px;
    border-radius: $radius-sm;
    background: $color-ink;
    object-fit: contain;
  }

  &__issuer-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__issuer-label {
    font-family: $font-mono;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $color-faint;
  }
}

.about-viewer {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba($color-ink, 0.86);
  backdrop-filter: blur(10px);

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border: 1px solid $color-line-high;
    border-radius: 50%;
    background: $color-panel;
    font-size: 1.4rem;
    line-height: 1;
    transition: border-color $transition, color $transition;

    &:hover {
      border-color: $color-led;
      color: $color-led;
    }
  }

  &__frame {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: min(960px, 100%);
    max-height: calc(100vh - 48px);
  }

  &__image {
    max-height: calc(100vh - 140px);
    width: auto;
    max-width: 100%;
    margin-inline: auto;
    border-radius: $radius-md;
    object-fit: contain;
  }

  &__caption {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.9rem;
    color: $color-muted;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.05rem;
    font-weight: 600;
    color: $color-text;
  }
}

.about-viewer-enter-active,
.about-viewer-leave-active {
  transition: opacity 0.3s $ease-out;
}

.about-viewer-enter-from,
.about-viewer-leave-to {
  opacity: 0;
}
</style>
