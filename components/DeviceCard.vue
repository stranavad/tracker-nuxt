<script setup lang="ts">
import type {Device, DeviceHealth} from "~/types";
import type {UpdateTrackerDto} from "~/api/tracker";

const props = defineProps<{
  device: Device
}>();

const emit = defineEmits<{
  update: [data: UpdateTrackerDto],
  reset: []
}>();

const lastRecord = computed<DeviceHealth | null>(() => {
  const lastRecord = props.device.records.at(-1);

  if(!lastRecord){
    return null
  }

  return lastRecord
})

const modalOpened = ref(false);

</script>

<template>
<DeviceUpdateModal
  v-model:open="modalOpened"
  :device="device"
  @submit="modalOpened = false; emit('update', $event)"
/>
<div
  class="border border-gray-600 rounded-md p-2"
>
  <div>
    <span class="text-xs text-slate-300 mr-2">#{{device.id}}</span>
    <span class="mr-2">{{device.name}}</span>
    <ColorBadge :color="device.color"/>
  </div>
  <div v-if="lastRecord" class="flex flex-col text-sm text-slate-300">
    <span>Last record:</span>
    <span>Last seen: {{$dayjs(lastRecord.timestamp).format('DD. MM. HH:mm:ss')}}</span>
    <span>Voltage: {{lastRecord.voltage}}</span>
    <span>Trace: {{lastRecord.trace}}</span>
  </div>
  <div class="flex gap-2 mt-4">
    <UButton size="xs" color="info" label="Update" @click="modalOpened = true"/>
    <UButton size="xs" color="error" label="Delete history" @click="emit('reset')"/>
  </div>
</div>
</template>
