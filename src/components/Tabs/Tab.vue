<template>
  <li :class="{ tab: true, 'tab--active': active }">
    <div class="tabContent">
      <button class="button" @click="$emit('click', index)">
        {{ title }}
      </button>
      <div class="closeIcon" @click="$emit('close', index)">X</div>
    </div>
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
    active: {
      type: Boolean,
      default: false,
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
.tab {
  position: relative;
  display: flex;
  min-height: 100%;
  min-width: 100px;
  z-index: 0;

  &--active.tab {
    .tabContent {
      border-color: purple;
    }
  }

  .tabContent {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    -webkit-bordertop-right-radius: 10px;
    -webkit-bordertop-left-radius: 10px;
    border-width: 3px 3px 0 3px;
    border-style: solid;
    border-color: #fff;
    background-color: #fff;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    width: 100%;

    .button {
      width: 100%;
      height: 100%;
      flex: 1;
      padding: 0 20px;
      text-decoration: none;
      text-align: center;
      overflow: hidden;
      user-select: none;
      -webkit-user-select: none;
      -webkit-user-drag: none;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      cursor: pointer;
      transition: 0.3s;
      background-color: #fff;

      &:hover {
        background-color: #f0f0f0;
      }
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
      -webkit-user-select: none;
    }
  }
}
</style>
