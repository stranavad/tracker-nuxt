<script setup lang="ts">
import {useAsyncData} from "#app";
import {apiGetDevicesHealth, apiGetTrackersHealth} from "~/api/health";
import type {Device} from "~/types";
import {apiUpdateTracker, type UpdateTrackerDto} from "~/api/tracker";
import {apiUpdateDevice} from "~/api/device";

const {data: devices, refresh: refreshDevices} = await useAsyncData<Device[]>('devices-health', apiGetDevicesHealth)
const {data: trackers, refresh: refreshTrackers} = await useAsyncData<Device[]>('trackers-health', apiGetTrackersHealth)

if(!devices.value || !trackers.value){
  throw createError({
    fatal: true,
    message: "Failed to load devices and trackers"
  })
}

async function refresh(){
  await Promise.all([refreshTrackers(), refreshDevices()])
}

async function updateTracker(data: UpdateTrackerDto, trackerId: string) {
  await apiUpdateTracker(trackerId, data)
  await refresh();
}

async function updateDevice(data: UpdateTrackerDto, deviceId: string) {
  await apiUpdateDevice(deviceId, data)
  await refresh();
}

async function resetTracker(trackerId: string){}

async function resetDevice(deviceId: string){}


</script>

<template>
<div
  v-if="trackers"
  class="flex flex-col gap-2"
>
  <span class="block mb-2 text-lg font-semibold">Trackers</span>
  <div class="flex flex-wrap gap-2">
    <DeviceCard
        v-for="tracker in trackers"
        :key="tracker.id"
        :device="tracker"
        @update="updateTracker($event, tracker.id)"
        @reset="resetTracker(tracker.id)"
    />
  </div>
</div>
<div
  v-if="devices"
  class="flex flex-col gap-2 mt-4"
>
  <span class="block mb-2 text-lg font-semibold">Devices</span>
  <DeviceCard
    v-for="device in devices"
    :key="device.id"
    :device="device"
    @update="updateDevice($event, device.id)"
    @reset="resetDevice(device.id)"
  />
</div>
</template>
