<template>
  <li :class="{ tab: true, 'tab--active': active, 'tab--removed': isFile && removed }">
    <div class="tabContent" @click="$emit('click', index)">
      <span class="fileName">
        {{ title }}
      </span>
      <button v-show="isFile && !saved" class="saveButton" @click="saveFile">
        <font-awesome-icon :icon="faFloppyDisk" />
      </button>
      <button class="closeIcon" @click.capture="$emit('close', index)">
        <font-awesome-icon :icon="faCircleXmark" />
      </button>
    </div>
  </li>
</template>
<script lang="ts">
import { useWorkspaceStore } from '@/stores'
import { faCircleXmark, faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'TabComponent',
  components: {
    FontAwesomeIcon,
  },
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
    const saved = computed<boolean>(() => store.files[props.id]?.saved)
    const removed = computed<boolean>(() => store.files[props.id]?.removed)
    const isFile = computed<boolean>(() => !!store.files[props.id])

    const saveFile = () => {
      store.saveFile(props.id)
    }

    return {
      title,
      saved,
      removed,
      faFloppyDisk,
      faCircleXmark,
      isFile,
      saveFile,
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

  &--removed.tab {
    text-decoration: line-through;
  }

  .tabContent {
    display: flex;
    justify-content: center;
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
    transition: 0.3s;
    padding-right: 25px;

    &:hover {
      background-color: #f0f0f0;
    }

    .fileName {
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      user-select: none;
      -webkit-user-select: none;
      max-width: 100px;
    }

    .saveButton {
      width: 100%;
      height: 100%;
      flex: 1;
      padding: 0 5px;
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
      background: transparent;

      &:hover svg {
        transform: scale(1.2);
      }
    }

    .closeIcon {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      background: transparent;
      border: none;
      transition: 0.3s;

      &:hover svg {
        transform: scale(1.2);
      }
    }
  }
}
</style>
