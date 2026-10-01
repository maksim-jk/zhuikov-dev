<script setup lang="ts">
const { board, viewBox, liveTraces, getPulseStyle, getNodeStyle, getPins } = useCircuitBackground()
</script>

<template>
  <div
    class="circuit"
    aria-hidden="true"
  >
    <svg
      class="circuit__layer"
      :viewBox="viewBox"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        v-for="trace in board.traces"
        :key="trace.id"
        class="circuit__trace"
        :d="trace.d"
      />
      <g
        v-for="chip in board.chips"
        :key="chip.id"
      >
        <rect
          class="circuit__chip"
          :x="chip.x"
          :y="chip.y"
          :width="chip.width"
          :height="chip.height"
          rx="6"
        />
        <path
          class="circuit__trace"
          :d="getPins(chip)"
        />
      </g>
      <circle
        v-for="trace in board.traces"
        :key="`via-${trace.id}`"
        class="circuit__via"
        :cx="trace.end.x"
        :cy="trace.end.y"
        r="4"
      />

      <g class="circuit__current">
        <path
          v-for="trace in liveTraces"
          :key="`pulse-${trace.id}`"
          class="circuit__pulse"
          :d="trace.d"
          :style="getPulseStyle(trace)"
        />
        <circle
          v-for="trace in liveTraces"
          :key="`node-${trace.id}`"
          class="circuit__node"
          :cx="trace.end.x"
          :cy="trace.end.y"
          r="5"
          :style="getNodeStyle(trace)"
        />
      </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.circuit {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  opacity: 0.55;
  pointer-events: none;
  mask-image: linear-gradient(90deg, #000, transparent 16%, transparent 84%, #000);

  @include respond($bp-lg) {
    display: none;
  }

  &__layer {
    width: 100%;
    height: 100%;
  }

  &__trace,
  &__chip,
  &__via {
    fill: none;
    stroke: $color-line;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  &__chip,
  &__via {
    fill: $color-ink;
  }

  &__pulse {
    fill: none;
    stroke: $color-led;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dashoffset: var(--from);
    opacity: 0.6;
    animation: circuit-pulse linear infinite;
  }

  &__node {
    fill: $color-led;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation: circuit-node linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &__current {
      display: none;
    }
  }
}

@keyframes circuit-pulse {
  0% { stroke-dashoffset: var(--from); }
  60%, 100% { stroke-dashoffset: var(--to); }
}

@keyframes circuit-node {
  0%, 57% { opacity: 0; transform: scale(0.4); }
  61% { opacity: 0.8; transform: scale(1.3); }
  80%, 100% { opacity: 0; transform: scale(1); }
}
</style>
