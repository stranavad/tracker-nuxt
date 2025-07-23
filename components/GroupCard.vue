<script setup lang="ts">
import type {Group} from "~/types";

defineProps<{
  group: Group
}>();

const emit = defineEmits<{
  update: [],
  delete: [],
  deleteTeam: [number],
  updateTeam: [number]
}>();
</script>

<template>
<div class="border border-gray-600 rounded-md p-2">
  <div class="flex items-center justify-between">
    <span class="font-semibold text-lg">{{group.name}}</span>
    <div class="flex gap-2 mt-4">
      <UButton size="xs" color="info" label="Update" @click="emit('update')"/>
      <UButton size="xs" color="error" label="Delete" @click="emit('delete')"/>
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <span class="text-sm text-slate-300">Teams:</span>
    <div
      v-for="team in group.teams"
      :key="team.id"
      class="border border-gray-600 rounded-md p-2 items-center justify-between flex"
    >
      {{team.name}}
      <div class="flex gap-2">
        <UButton size="xs" color="info" label="Update" @click="emit('updateTeam', team.id)"/>
        <UButton size="xs" color="error" label="Delete" @click="emit('deleteTeam', team.id)"/>
      </div>
    </div>
  </div>
</div>
</template>
