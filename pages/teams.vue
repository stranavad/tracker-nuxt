<script setup lang="ts">
import {
  apiCreateGroup,
  apiCreateTeam, apiDeleteGroup, apiDeleteTeam,
  apiGetGroups,
  apiUpdateGroup, apiUpdateTeam,
  type CreateGroupDto,
  type CreateTeamDto
} from "~/api/manage";
import type {Group} from "~/types";

const {data: groups, refresh: refreshGroups} = await useAsyncData<Group[]>('groups', apiGetGroups)
if(!groups.value){
  throw createError({
    fatal: true,
    message: "Failed to load groups"
  })
}

const editingGroupId = ref<number | null>(null);
const groupModalOpened = ref(false);

const editingTeamId = ref<number | null>(null);
const teamModalOpened = ref(false)

async function onGroupModalSubmit(data: CreateGroupDto){
  if(editingGroupId.value){
    await apiUpdateGroup(data, editingGroupId.value)
  } else {
    await apiCreateGroup(data)
  }

  await refreshGroups()
  closeGroupModal()
}

async function onTeamModalSubmit(data: CreateTeamDto){
  if(editingTeamId.value){
    await apiUpdateTeam(data, editingTeamId.value)
  } else {
    await apiCreateTeam(data)
  }

  await refreshGroups();
  closeTeamModal()
}

async function deleteGroup(groupId: number){
  await apiDeleteGroup(groupId)
  await refreshGroups()
}

async function deleteTeam(teamId: number){
  await apiDeleteTeam(teamId);
  await refreshGroups()
}

function openTeamUpdateModal(teamId: number){
  editingTeamId.value = teamId;
  teamModalOpened.value = true
}

function openTeamCreateModal(){
  editingTeamId.value = null;
  teamModalOpened.value = true
}

function closeTeamModal(){
  editingTeamId.value = null;
  teamModalOpened.value = false
}

function openGroupEditModal(group: Group){
  editingGroupId.value = group.id;
  groupModalOpened.value = true
}

function openGroupCreateModal(){
  editingGroupId.value = null;
  groupModalOpened.value = true
}

function closeGroupModal(){
  groupModalOpened.value = false;
  editingGroupId.value = null
}
</script>

<template>
<div
  v-if="groups"
>
  <div class="flex items-center justify-between mb-2">
    <span class="block mb-2 text-lg font-semibold">Groups</span>
    <div class="flex gap-2">
      <UButton size="sm" label="Create group" @click="openGroupCreateModal"/>
      <UButton size="sm" label="Create team" @click="openTeamCreateModal"/>
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <GroupCard
      v-for="group in groups"
      :key="group.id"
      :group="group"
      @update-team="openTeamUpdateModal"
      @update="openGroupEditModal(group)"
      @delete="deleteGroup(group.id)"
      @delete-team="deleteTeam"
    />
  </div>
  <GroupModal
    v-model:open="groupModalOpened"
    :group-id="editingGroupId"
    @submit="onGroupModalSubmit"
  />
  <TeamModal
    v-model:open="teamModalOpened"
    :team-id="editingTeamId"
    :groups="groups"
    @submit="onTeamModalSubmit"
  />
</div>
</template>
