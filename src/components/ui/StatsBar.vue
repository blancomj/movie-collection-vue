<template>
  <div class="bg-white rounded-card shadow-sm p-4">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
  width: { type: Number, default: 400 },
  height: { type: Number, default: 200 },
  color: { type: String, default: '#667eea' }
})

const canvas = ref(null)

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, props.width, props.height)

  const entries = Object.entries(props.data)
  if (!entries.length) return

  const maxVal = Math.max(1, ...entries.map(([, v]) => v))
  const barWidth = Math.min(40, (props.width - 40) / entries.length - 8)
  const chartHeight = props.height - 40
  const startX = 30

  ctx.fillStyle = '#e5e7eb'
  ctx.font = '10px sans-serif'
  ctx.textAlign = 'right'

  for (let i = 0; i <= 4; i++) {
    const y = 10 + (chartHeight / 4) * i
    ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), 25, y + 4)
    ctx.beginPath()
    ctx.strokeStyle = '#f3f4f6'
    ctx.moveTo(30, y)
    ctx.lineTo(props.width, y)
    ctx.stroke()
  }

  entries.forEach(([label, value], i) => {
    const barHeight = (value / maxVal) * chartHeight
    const x = startX + i * (barWidth + 8)
    const y = 10 + chartHeight - barHeight

    const gradient = ctx.createLinearGradient(x, y, x, 10 + chartHeight)
    gradient.addColorStop(0, props.color)
    gradient.addColorStop(1, '#764ba2')
    ctx.fillStyle = gradient

    ctx.beginPath()
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0])
    ctx.fill()

    ctx.fillStyle = '#6b7280'
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'
    ctx.save()
    ctx.translate(x + barWidth / 2, 10 + chartHeight + 15)
    ctx.rotate(-Math.PI / 6)
    ctx.fillText(label, 0, 0)
    ctx.restore()
  })
}

onMounted(draw)
watch(() => props.data, draw, { deep: true })
</script>