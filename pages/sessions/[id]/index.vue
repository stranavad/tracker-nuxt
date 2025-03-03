<script setup lang="ts">
import {apiGetSessionById, apiResetSessionTracker} from "~/api/session";
import type {TrackerRecordResponse} from "~/types";
import {getTimeDifference} from "~/utils/time";
import {trackerColors, trackerColorsMap, trackerColorStrokeMap} from "~/data/colors";
import {apiUpdateTracker} from "~/api/tracker";

const route = useRoute();
const sessionId = Number(route.params.id);

if(isNaN(sessionId)){
  throw createError({
    fatal: true,
    message: "Invalid session ID"
  })
}

const {data: session, refresh: refreshSession} = await useAsyncData(() => apiGetSessionById(sessionId));

if(!session.value){
  throw createError({
    fatal: true,
    message: "Session not found"
  })
}

const trackerVisibilityMap = ref<{[k: string]: boolean}>({});

watch(() => session.value?.trackers.length, () => {
  if(!session.value){
    return
  }

  trackerVisibilityMap.value = session.value.trackers.reduce((acc: {[k: string]: boolean}, current) => {
    acc[current.id] = true;
    return acc
  }, {})
}, {immediate: true})

const globalL = ref<Awaited<typeof import("leaflet")> | null>(null);
const initialCoordinates = ref<[number, number]>([50, 14]);

function getInitialCoordinates(){
  if(!session.value?.trackers.length){
    return
  }

  const tracker = session.value.trackers[0];
  if(!tracker.latestRecord){
    return
  }

  initialCoordinates.value = [tracker.latestRecord.lat, tracker.latestRecord.long]
}

async function resetSessionTracker(trackerId: string){
  if(!session.value){
    return
  }

  await apiResetSessionTracker(session.value.id, trackerId)
  await refreshSession()
}

async function updateTrackerColor(trackerId: string, color: string): Promise<void>{
  await apiUpdateTracker(trackerId, color)
  await refreshSession()
}

function calculateTotalDistance(records: TrackerRecordResponse[]): number {
  if(!globalL.value){
    return 0
  }

  const points = getTrackerCoordinates(records)

  let totalDistance = 0;

  const L = window.L
  for (let i = 0; i < points.length - 1; i++) {
    const fromPoint = L.latLng(points[i]);
    const to = L.latLng(points[i + 1]);

    // distanceTo returns meters
    totalDistance += fromPoint.distanceTo(to);
  }

  // Convert to kilometers
  return Number((totalDistance / 1000).toFixed(2));
}

function onCreated(){
  getInitialCoordinates()
}

onCreated();

function getTrackerCoordinates(records: TrackerRecordResponse[]): [number, number][]{
  return records.map(r => ([r.lat, r.long]))
}


let refreshInterval: NodeJS.Timeout

onMounted(() => {
  import("leaflet").then((l) => {
    globalL.value = l
  })

  refreshInterval = setInterval(() => {
    refreshSession()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(refreshInterval)
})

</script>

<template>
<div v-if="session">
  <span class="text-lg font-semibold">
    {{session.name}}
  </span>
  <div>
    <LMap
        style="height: 500px"
        :zoom="12"
        :center="initialCoordinates"
        :use-global-leaflet="false"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
      />
      <ClientOnly
        v-if="globalL"
      >
        <LMarker
          v-for="tracker in session.trackers.filter(t => !!t.latestRecord && trackerVisibilityMap[t.id])"
          :lat-lng="[tracker.latestRecord!.lat, tracker.latestRecord!.long]"
          :icon='globalL.divIcon({
            className: "marker-icon",
            html: `<div style="width: 15px; height: 15px; border: 2px solid black; background-color: ${tracker.name}; border-radius: 50%;"/>`,
            iconSize: [15, 15],
            iconAnchor: [7.5, 7.5]
          })'
        >
          <LPopup>{{tracker.id}}/{{tracker.name}}</LPopup>
        </LMarker>
      </ClientOnly>
      <LPolyline
        v-for="tracker in session.trackers.filter(t => trackerVisibilityMap[t.id])"
        :key="`${tracker.id}-${tracker.name}`"
        dash-array="4 10"
        :weight="2"
        :class-name="trackerColorStrokeMap[tracker.name]"
        :lat-lngs="getTrackerCoordinates(tracker.records)"
      />
    </LMap>
  </div>
  <div class="flex flex-col gap-4 mt-2">
    <div
      v-for="tracker in session.trackers"
      class="border border-gray-600 rounded-md p-2"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center mb-2">
          <span class="text-sm mr-2">
            #{{tracker.id}}
          </span>
          <UPopover>
            <div class="w-4 h-4 rounded-full" :class="trackerColorsMap[tracker.name]"/>
            <template #content>
              <div class="p-2 flex gap-2">
                <div
                  v-for="color in trackerColors"
                  class="w-6 h-6 rounded-full"
                  :class="trackerColorsMap[color]"
                  @click="updateTrackerColor(tracker.id, color)"
                />
              </div>
            </template>
          </UPopover>
        </div>
        <div class="flex gap-2">
          <UButton
              size="xs"
              :color="trackerVisibilityMap[tracker.id] ? 'info' : 'success'"
              :label="trackerVisibilityMap[tracker.id] ? 'Hide' : 'Show'"
              @click="trackerVisibilityMap[tracker.id] = !trackerVisibilityMap[tracker.id]"
          />
          <UButton size="xs" color="error" label="Start/Reset" @click="resetSessionTracker(tracker.id)"/>
        </div>
      </div>
      <div
        v-if="tracker.firstRecord"
        class="flex flex-col text-xs text-gray-400"
      >
        <span>
          Distance: {{calculateTotalDistance(tracker.records)}}km
        </span>
        <span
        >
          First seen: {{$dayjs(tracker.firstRecord.createdAt).format('DD. MM. HH:mm:ss')}}
        </span>
        <span>
          Last seen: {{$dayjs(tracker.latestRecord.createdAt).format('DD. MM. HH:mm:ss')}}
        </span>
        <span>
          Duration: {{getTimeDifference(tracker.latestRecord.createdAt, tracker.firstRecord.createdAt)}}
        </span>
        <span>
          Rssi: {{tracker.latestRecord.rssi}}
        </span>
        <span>
          Snr: {{tracker.latestRecord.snr}}
        </span>
      </div>
    </div>
  </div>
</div>
</template>
