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
import {useStorage} from '@vueuse/core'

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
const showEmptyCreates = useStorage("show-empty-creates", true)

const createGroupState = ref<CreateGroupDto>({
  name: ''
})


async function onGroupModalSubmit(data: CreateGroupDto){
  await apiUpdateGroup(data, editingGroupId.value)
  await refreshGroups()

  closeGroupModal()
}

async function onTeamModalSubmit(data: CreateTeamDto){
  await apiUpdateTeam(data, editingTeamId.value)
  await refreshGroups();

  closeTeamModal()
}

async function onCreateGroup(event: FormSubmitEvent<CreateGroupDto>): Promise<void>{
  await apiCreateGroup(event.data)
  await refreshGroups();
}

async function onCreateTeam(name: string, groupId: number): Promise<void> {
  await apiCreateTeam({name, groupId})
  await refreshGroups();
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
      <UButton color="neutral" size="sm" variant="soft" :label="showEmptyCreates ? 'Hide empty create fields' : 'Hide empty create fields'" @click="showEmptyCreates = !showEmptyCreates"/>
    </div>
  </div>
  <div class="flex flex-col gap-4">
    <GroupCard
      v-for="group in groups"
      :key="group.id"
      :group="group"
      :show-empty-creates="showEmptyCreates"
      @update-team="openTeamUpdateModal"
      @update="openGroupEditModal(group)"
      @delete="deleteGroup(group.id)"
      @delete-team="deleteTeam"
      @create-team="onCreateTeam($event, group.id)"
      @update-show-empty-creates="showEmptyCreates = $event"
    />
    <UCard
        v-if="showEmptyCreates"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <span>Create new group</span>
                <UButton icon="i-heroicons-eye-slash-solid" variant="soft" color="neutral" @click="showEmptyCreates = false"/>
            </div>
        </template>
        <UForm
            class="flex gap-2"
            :state="createGroupState"
            :schema="createGroupSchema"
            @submit="onCreateGroup"
        >
            <UFormField name="name">
                <UInput v-model="createGroupState.name" placeholder="New group"/>
            </UFormField>
            <UButton label="Create" variant="soft"/>
        </UForm>
    </UCard>
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
