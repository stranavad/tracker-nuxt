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
<UCard
    class="min-w-[250px]"
>
    <template #header>
        <div class="flex justify-between items-center pb-1">
            <div class="flex gap-2 items-center">
                <!-- <ColorBadge :color="device.color"/> -->
                <div class="h-[14px] w-[3px] rounded-md" :style="{backgroundColor: device.color || 'white'}"/>
                <span>{{device.name}}</span>
            </div>
            <div class="flex gap-2">
                <UButton icon="i-heroicons-pencil-square" variant="soft" @click="modalOpened = true"/>
                <UButton icon="i-heroicons-trash" variant="soft" color="error" @click="emit('reset')"/>
            </div>
        </div>
    </template>
    <div class="flex flex-col text-sm">
        <span>Id: {{device.id}}</span>
        <span v-if="lastRecord">Last record:</span>
        <span v-if="lastRecord">Last seen: {{$dayjs(lastRecord.timestamp).format('DD. MM. HH:mm:ss')}}</span>
        <span v-if="lastRecord">Voltage: {{lastRecord.voltage}}</span>
        <span v-if="lastRecord">Trace: {{lastRecord.trace}}</span>
    </div>
</UCard>
</template>
