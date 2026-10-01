<script setup lang="ts">
const { input, command, lines, suggestions, onKeydown, focusInput, runSuggestion } = useTerminal()
</script>

<template>
  <section
    id="terminal"
    class="terminal"
  >
    <SectionHeading
      :index="$t('terminal.index')"
      :title="$t('terminal.title')"
      :subtitle="$t('terminal.subtitle')"
    />

    <div class="terminal__wrap">
      <div
        v-reveal
        class="terminal__window"
        @click="focusInput"
      >
        <div class="terminal__bar">
          <span class="terminal__dot" />
          <span class="terminal__dot" />
          <span class="terminal__dot" />
          <span class="terminal__bar-title">maks@zhuikov: ~</span>
        </div>

        <div
          class="terminal__body"
          aria-live="polite"
        >
          <div class="terminal__scroll">
            <p
              v-for="line in lines"
              :key="line.id"
              class="terminal__line"
              :class="`terminal__line--${line.kind}`"
            >
              {{ line.text }}
            </p>

            <label class="terminal__prompt">
              <span
                class="terminal__prompt-sign"
                aria-hidden="true"
              >❯</span>
              <input
                ref="input"
                v-model="command"
                class="terminal__input"
                type="text"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                :placeholder="$t('terminal.placeholder')"
                :aria-label="$t('terminal.placeholder')"
                @keydown="onKeydown"
              >
            </label>
          </div>
        </div>
      </div>

      <div class="terminal__suggestions">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          type="button"
          class="terminal__suggestion"
          @click="runSuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.terminal {
  padding-block: clamp(100px, 14vw, 180px) 0;

  &__wrap {
    @include container;
  }

  &__window {
    overflow: hidden;
    border: 1px solid $color-line;
    border-radius: $radius-lg;
    background: $color-ink;
    box-shadow: 0 30px 80px -30px $color-led-dim;
    cursor: text;
  }

  &__bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 18px;
    border-bottom: 1px solid $color-line;
    background: $color-panel;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $color-line-high;

    &:first-child {
      background: $color-led;
      box-shadow: 0 0 8px $color-led-glow;
    }
  }

  &__bar-title {
    margin-left: 12px;
    font-family: $font-mono;
    font-size: 0.75rem;
    color: $color-faint;
  }

  &__body {
    display: flex;
    flex-direction: column-reverse;
    height: 420px;
    overflow-y: auto;
    padding: 20px 22px;
    scrollbar-width: thin;
    scrollbar-color: $color-line-high transparent;
  }

  &__line {
    font-family: $font-mono;
    font-size: 0.875rem;
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-word;
    color: $color-muted;

    &--input {
      color: $color-text;

      &::before {
        content: '❯ ';
        color: $color-led;
      }
    }

    &--error {
      color: $color-led-hot;
    }

    &--accent {
      color: $color-led;
    }
  }

  &__prompt {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }

  &__prompt-sign {
    color: $color-led;
    font-family: $font-mono;
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: $font-mono;
    font-size: 0.875rem;
    line-height: 1.7;
    color: $color-text;
    caret-color: $color-led;

    &::placeholder {
      color: $color-faint;
    }
  }

  &__suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }

  &__suggestion {
    padding: 8px 14px;
    border: 1px dashed $color-line-high;
    border-radius: $radius-sm;
    font-family: $font-mono;
    font-size: 0.8rem;
    color: $color-muted;
    transition: color $transition, border-color $transition;

    &:hover {
      border-color: $color-led;
      color: $color-led;
    }
  }
}
</style>
