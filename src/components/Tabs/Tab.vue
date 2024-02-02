<template>
  <li>
    <button class="card" @click="$emit('click', index)">
      {{ title }}
    </button>
    <div class="closeIcon" @click="$emit('close', index)">X</div>
  </li>
</template>
<script lang="ts">
import { useWorkspaceStore } from '@/stores'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'TabComponent',
  props: {
    id: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  emits: ['click', 'close'],
  setup(props) {
    const store = useWorkspaceStore()

    const title = computed<string>(() => (store.files[props.id] ? store.files[props.id].title : props.id))

    return {
      title,
    }
  },
})
</script>
<style lang="scss" scoped>
li {
  position: relative;
  display: flex;
  min-height: 100%;
  width: 100px;
  min-width: 100px;
  background-color: #fff;
  .card {
    width: 100%;
    height: 100%;
    color: #888;
    flex: 1;
    padding: 0 20px;
    text-decoration: none;
    text-align: center;
    overflow: hidden;
    user-select: none;
    -webkit-user-drag: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .closeIcon {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
}
</style>
