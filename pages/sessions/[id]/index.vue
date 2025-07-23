<script setup lang="ts">
import {apiGetSessionById, apiResetSessionTracker, apiUpdateTeamToTracker} from "~/api/session";
import {getTimeDifference} from "~/utils/time";
import {trackerColors, trackerColorsMap, trackerColorStrokeMap} from "~/data/colors";
import {apiUpdateTracker} from "~/api/tracker";
import type {Group, TrackerRecord} from "~/types";
import {apiGetGroups} from "~/api/manage";

const route = useRoute();
const sessionId = Number(route.params.id);

if(isNaN(sessionId)){
  throw createError({
    fatal: true,
    message: "Invalid session ID"
  })
}

const {data: session, refresh: refreshSession} = await useAsyncData(`session-data-${sessionId}`,() => apiGetSessionById(sessionId));
const {data: groups, refresh: refreshGroups} = await useAsyncData<Group[]>('groups', apiGetGroups)

if(!session.value || !groups.value){
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

  const tracker = session.value.trackers[0]!;
  const latestRecord = tracker.records.at(-1)

  if(!latestRecord){
    return
  }

  initialCoordinates.value = [latestRecord.lat, latestRecord.long]
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

function calculateTotalDistance(records: TrackerRecord[]): number {
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

function getTrackerCoordinates(records: TrackerRecord[]): [number, number][]{
  return records.map(r => ([r.lat, r.long]))
}


async function updateTeamToTracker(trackerId: string, teamId: number){
  await apiUpdateTeamToTracker(sessionId, teamId, trackerId)
  await refreshSession()
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
<div v-if="session && groups">
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
          v-for="tracker in session.trackers.filter(t => !!t.records.length && trackerVisibilityMap[t.id])"
          :lat-lng="[tracker.records.at(-1)!.lat, tracker.records.at(-1)!.long]"
          :icon='globalL.divIcon({
            className: "marker-icon",
            html: `<div style="width: 15px; height: 15px; border: 2px solid black; background-color: ${tracker.color}; border-radius: 50%;"/>`,
            iconSize: [15, 15],
            iconAnchor: [7.5, 7.5]
          })'
        >
          <LPopup>
            {{tracker.name ? tracker.name : tracker.id}}
          </LPopup>
        </LMarker>
      </ClientOnly>
      <LPolyline
        v-for="tracker in session.trackers.filter(t => trackerVisibilityMap[t.id])"
        :key="`${tracker.id}-${tracker.name}`"
        dash-array="4 10"
        :weight="2"
        :color="tracker.color"
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
            <span class="text-xs text-slate-300">#{{tracker.id}}</span>
            {{tracker.name}}
          </span>
          <UPopover>
            <div class="w-4 h-4 rounded-full" :style="{backgroundColor: tracker.color}"/>
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
      <div class="mb-2">
        <span class="text-xs text-slate-300">Team:</span>
        <USelect
          label-key="name"
          value-key="id"
          class="w-[150px] ml-2"
          size="sm"
          :model-value="tracker.team?.id || 0"
          :items="groups.map(group => group.teams).flat()"
          @update:model-value="updateTeamToTracker(tracker.id, $event)"
        />
      </div>
      <div
        v-if="tracker.records.length"
        class="flex flex-col text-xs text-gray-400"
      >
        <span>
          Distance: {{calculateTotalDistance(tracker.records)}}km
        </span>
        <span
        >
          First seen: {{$dayjs(tracker.records[0].createdAt).format('DD. MM. HH:mm:ss')}}
        </span>
        <span>
          Last seen: {{$dayjs(tracker.records.at(-1)!.createdAt).format('DD. MM. HH:mm:ss')}}
        </span>
        <span>
          Duration: {{getTimeDifference(tracker.records.at(-1)!.createdAt, tracker.records[0].createdAt)}}
        </span>
      </div>
    </div>
  </div>
</div>
</template>
