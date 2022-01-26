import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const title = 'web macOS'

    return () => (
      <div class="text-center p-10">
        <h1 class="text-6xl">{title}</h1>
      </div>
    )
  },
})
