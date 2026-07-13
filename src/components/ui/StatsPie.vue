<template>
  <div class="bg-white rounded-card shadow-sm p-4 flex items-center justify-center">
    <canvas ref="canvas" :width="size" :height="size"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
  size: { type: Number, default: 200 },
  colors: { type: Array, default: () => ['#667eea', '#764ba2', '#ffd700', '#28a745', '#dc3545', '#17a2b8', '#ffc107', '#ff6384'] }
})

const canvas = ref(null)

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, props.size, props.size)

  const entries = Object.entries(props.data)
  if (!entries.length) return

  const total = entries.reduce((sum, [, v]) => sum + v, 0)
  const cx = props.size / 2
  const cy = props.size / 2
  const radius = Math.min(cx, cy) - 10

  let startAngle = -Math.PI / 2

  entries.forEach(([label, value], i) => {
    const sliceAngle = (value / total) * 2 * Math.PI
    const endAngle = startAngle + sliceAngle

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = props.colors[i % props.colors.length]
    ctx.fill()

    if (sliceAngle > 0.2) {
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.65
      const lx = cx + Math.cos(midAngle) * labelRadius
      const ly = cy + Math.sin(midAngle) * labelRadius

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(Math.round((value / total) * 100) + '%', lx, ly)
    }

    startAngle = endAngle
  })

  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  ctx.fillStyle = '#333333'
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(total, cx, cy - 6)
  ctx.font = '10px sans-serif'
  ctx.fillStyle = '#999999'
  ctx.fillText('peliculas', cx, cy + 10)
}

onMounted(draw)
watch(() => props.data, draw, { deep: true })
</script>