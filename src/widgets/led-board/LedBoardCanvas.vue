<script setup lang="ts">
const {
  canvas,
  glow,
  viewport,
  canvasStyle,
  isScrollable,
  isPanMode,
  onPointerDown,
  onPointerMove,
} = useLedBoardCanvas()
</script>

<template>
  <div
    ref="viewport"
    class="led-canvas"
    :class="{ 'led-canvas--scrollable': isScrollable, 'led-canvas--pan': isPanMode }"
  >
    <div
      class="led-canvas__stage"
      :style="canvasStyle"
    >
      <canvas
        ref="canvas"
        class="led-canvas__matrix"
        :style="canvasStyle"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
      />
      <canvas
        ref="glow"
        class="led-canvas__glow"
        :style="canvasStyle"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.led-canvas {
  width: 100%;
  overflow: hidden;

  &--scrollable {
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: $color-line-high transparent;
  }

  &__stage {
    position: relative;
  }

  &__matrix {
    display: block;
    cursor: crosshair;
    touch-action: none;
  }

  &--pan &__matrix {
    cursor: grab;
    touch-action: pan-x pan-y;
  }

  &__glow {
    position: absolute;
    inset: 0;
    image-rendering: auto;
    filter: blur(14px) saturate(1.4);
    mix-blend-mode: screen;
    opacity: 0.55;
    pointer-events: none;
  }
}
</style>
