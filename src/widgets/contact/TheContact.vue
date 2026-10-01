<script setup lang="ts">
const { email, mailto, links, year, localTime, copied, copyEmail } = useContact()
</script>

<template>
  <section
    id="contact"
    class="contact"
  >
    <SectionHeading
      :index="$t('contact.index')"
      :title="$t('contact.title')"
      :subtitle="$t('contact.text')"
    />

    <div class="contact__body">
      <div
        v-reveal
        class="contact__mail"
      >
        <div class="contact__mail-copy">
          <span class="contact__label">{{ $t('contact.mail-label') }}</span>
          <a
            :href="mailto"
            class="contact__email"
          >{{ email }}</a>
        </div>
        <div class="contact__actions">
          <a
            v-magnetic
            :href="mailto"
            class="contact__button contact__button--primary"
          >
            {{ $t('contact.write') }}
            <span aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            class="contact__button"
            :class="{ 'contact__button--copied': copied }"
            @click="copyEmail"
          >
            <span
              class="contact__copy-led"
              aria-hidden="true"
            />
            <span aria-live="polite">{{ copied ? $t('contact.copied') : $t('contact.copy') }}</span>
          </button>
        </div>
      </div>

      <div
        v-reveal="0.08"
        class="contact__cv"
      >
        <span class="contact__label">{{ $t('cv.card-title') }}</span>
        <span class="contact__cv-text">{{ $t('cv.card-text') }}</span>
        <CvDownload class="contact__cv-download" />
      </div>

      <ul
        v-reveal="0.12"
        class="contact__channels"
        :aria-label="$t('contact.channels-label')"
      >
        <li
          v-for="link in links"
          :key="link.id"
        >
          <a
            :href="link.href"
            class="contact__channel"
            :class="`contact__channel--${link.id}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              class="contact__channel-icon"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24">
                <path :d="link.icon" />
              </svg>
            </span>
            <span class="contact__channel-head">
              <span class="contact__channel-name">{{ link.label }}</span>
              <span class="contact__channel-handle">{{ link.handle }}</span>
            </span>
            <span class="contact__channel-text">{{ $t(`contact.channels.${link.id}`) }}</span>
            <span
              class="contact__channel-arrow"
              aria-hidden="true"
            >↗</span>
          </a>
        </li>
      </ul>

      <dl
        v-reveal="0.16"
        class="contact__facts"
      >
        <div class="contact__fact">
          <dt>{{ $t('contact.facts.status') }}</dt>
          <dd class="contact__status">
            <span
              class="contact__status-led"
              aria-hidden="true"
            />
            {{ $t('contact.facts.status-value') }}
          </dd>
        </div>
        <div class="contact__fact">
          <dt>{{ $t('contact.facts.response') }}</dt>
          <dd>{{ $t('contact.facts.response-value') }}</dd>
        </div>
        <div class="contact__fact">
          <dt>{{ $t('contact.facts.time') }}</dt>
          <dd>
            <ClientOnly>
              {{ $t('contact.facts.time-value', { time: localTime }) }}
              <template #fallback>
                UTC+5
              </template>
            </ClientOnly>
          </dd>
        </div>
        <div class="contact__fact">
          <dt>{{ $t('contact.facts.format') }}</dt>
          <dd>{{ $t('contact.facts.format-value') }}</dd>
        </div>
      </dl>
    </div>

    <footer class="contact__footer">
      <span>© {{ year }} Maksim Zhuikov</span>
      <span>{{ $t('contact.footer') }}</span>
    </footer>
  </section>
</template>

<style lang="scss" scoped>
.contact {
  padding-block: clamp(100px, 14vw, 180px) 0;

  &__body {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    grid-template-areas:
      'mail cv'
      'channels channels'
      'facts facts';
    gap: 16px;
    padding-bottom: clamp(80px, 10vw, 140px);

    @include container;

    @include respond($bp-lg) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'mail'
        'cv'
        'channels'
        'facts';
    }
  }

  &__mail {
    grid-area: mail;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
    padding: clamp(24px, 3.4vw, 40px);

    @include panel;
  }

  &__mail-copy {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-width: 0;
  }

  &__label {
    @include label;
  }

  &__email {
    max-width: 100%;
    overflow: hidden;
    font-family: $font-display;
    font-size: clamp(1.25rem, 3.2vw, 2.6rem);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.03em;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: color $transition, text-shadow $transition;

    &:hover {
      color: $color-led;
      text-shadow: 0 0 40px $color-led-glow;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__button {
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

    &--primary {
      border-color: $color-led;
      color: $color-ink;
      background: $color-led;
      box-shadow: 0 0 32px $color-led-glow;

      &:hover {
        border-color: $color-led-hot;
        background: $color-led-hot;
      }
    }

    &--copied {
      border-color: $color-ok;
      color: $color-ok;
    }
  }

  &__copy-led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $color-line-high;
    transition: background $transition, box-shadow $transition;
  }

  &__button--copied &__copy-led {
    background: $color-ok;
    box-shadow: 0 0 10px $color-ok;
  }

  &__cv {
    @include panel;

    grid-area: cv;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: clamp(24px, 3.4vw, 40px);
    border-color: color-mix(in srgb, $color-led 35%, transparent);
    background: linear-gradient(140deg, $color-led-dim, transparent 65%), $color-panel;
  }

  &__cv-text {
    max-width: 32ch;
    font-size: 0.95rem;
    line-height: 1.5;
    color: $color-muted;
  }

  &__cv-download {
    margin-top: auto;
  }

  &__channels {
    grid-area: channels;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;

    @include respond($bp-md) {
      grid-template-columns: 1fr;
    }
  }

  &__channel {
    --brand: #{$color-led};

    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    grid-template-areas:
      'icon head arrow'
      'icon text arrow';
    align-items: center;
    gap: 4px 16px;
    padding: 18px 22px;
    transition: border-color $transition, background $transition;

    @include panel;

    @each $id, $color in $brand-colors {
      &--#{$id} {
        --brand: #{$color};
      }
    }

    &:hover {
      border-color: color-mix(in srgb, var(--brand) 60%, transparent);
      background: color-mix(in srgb, var(--brand) 6%, $color-panel-high);
    }
  }

  &__channel-icon {
    grid-area: icon;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid $color-line-high;
    border-radius: $radius-md;
    background: $color-ink;
    color: $color-muted;
    transition: color $transition, border-color $transition, box-shadow $transition;

    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  }

  &__channel:hover &__channel-icon {
    border-color: color-mix(in srgb, var(--brand) 50%, transparent);
    color: var(--brand);
    box-shadow: 0 0 20px color-mix(in srgb, var(--brand) 30%, transparent);
  }

  &__channel-head {
    grid-area: head;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 10px;
  }

  &__channel-name {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    transition: color $transition;
  }

  &__channel:hover &__channel-name {
    color: $color-led;
  }

  &__channel-handle {
    font-family: $font-mono;
    font-size: 0.8rem;
    color: $color-muted;
  }

  &__channel-text {
    grid-area: text;
    font-size: 0.9rem;
    color: $color-faint;
  }

  &__channel-arrow {
    grid-area: arrow;
    justify-self: end;
    font-family: $font-mono;
    color: $color-muted;
    transition: color $transition, translate $transition;
  }

  &__channel:hover &__channel-arrow {
    color: $color-led;
    translate: 3px -3px;
  }

  &__facts {
    grid-area: facts;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px 24px;
    padding: 22px 24px;

    @include panel;

    @include respond($bp-lg) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include respond($bp-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__fact {
    dt {
      margin-bottom: 6px;

      @include label;

      color: $color-faint;
    }

    dd {
      font-size: 0.95rem;
      line-height: 1.45;
    }
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__status-led {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $color-ok;
    box-shadow: 0 0 10px $color-ok;
    animation: led-blink 1.6s ease-in-out infinite;
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    padding-block: 28px;
    border-top: 1px solid $color-line;

    @include container;
    @include label;
  }
}
</style>
