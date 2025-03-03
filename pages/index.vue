<script setup lang="ts">
import {
  apiCreateSession,
  apiListSessions, apiStopSession,
  apiUpdateSession,
  type CreateSessionDto,
  createSessionSchema
} from "~/api/session";
import {getTimeDifference} from "~/utils/time";
import type {FormSubmitEvent} from "#ui/types";

const {data: sessions, refresh: refreshSessions} = await useAsyncData(apiListSessions)
if(!sessions.value){
  throw createError({
    fatal: true,
    message: "sessions not found"
  })
}

/* Create/Update session */
const modalOpened = ref(false);
const editingSessionId = ref<number | null>(null)
const newSessionState = ref<CreateSessionDto>({
  name: ''
})
async function onModalSubmit(event: FormSubmitEvent<CreateSessionDto>){
  const data = event.data;

  if(editingSessionId.value){
    await apiUpdateSession(data, editingSessionId.value)
  } else {
    await apiCreateSession(data)
  }

  editingSessionId.value = null;
  newSessionState.value.name = "";
  modalOpened.value = false;

  await refreshSessions()
}

/* Stop session */
async function stopSession(sessionId: number){
  await apiStopSession(sessionId);
  await refreshSessions();
}

</script>

<template>
<UModal
  v-model:open="modalOpened"
  :title="editingSessionId ? 'Update session' : 'Create session'"
>
  <template #body>
    <UForm
      class="space-y-4"
      :state="newSessionState"
      :schema="createSessionSchema"
      @submit="onModalSubmit"
    >
      <UFormField label="Name" name="name" class="w-full">
        <UInput v-model="newSessionState.name" placeholder="AC - Trip do Mordoru"/>
      </UFormField>
      <UButton
        type="submit"
        size="sm"
        :label="editingSessionId ? 'Update' : 'Create'"
      />
    </UForm>
  </template>
</UModal>
<div>
  <div class="flex items-center justify-between mb-2">
    <span class="text-lg font-medium">
      Sessions
    </span>
    <UButton
      size="sm"
      label="Create"
      @click="
        editingSessionId = null;
        newSessionState.name = '';
        modalOpened = true;
      "
    />
  </div>
  <div class="flex flex-col gap-2">
    <NuxtLink
      v-for="session in sessions"
      :to="`/sessions/${session.id}`"
      class="border border-gray-600 rounded-md p-2"
    >
      <div class="flex justify-between items-center mb-1">
        <span>
          <span class="text-sm text-gray-400">#{{session.id}}</span>
          {{session.name}}
        </span>
        <UBadge v-if="!session.endTime" class="ml-2" size="sm">Active</UBadge>
      </div>
      <div class="text-xs">
        <div>
          <span class="mr-2">Start:</span>
          <span class="text-gray-400">{{$dayjs(session.startTime).format('DD. MM. HH:mm:ss')}}</span>
        </div>
        <div v-if="session.endTime">
          <span class="mr-2">End:</span>
          <span class="text-gray-400">{{$dayjs(session.endTime).format('DD. MM. HH:mm:ss')}}</span>
        </div>
        <div v-if="session.endTime">
          <span class="mr-2">Duration:</span>
          <span class="text-gray-400">{{getTimeDifference(session.endTime, session.startTime)}}</span>
        </div>
        <div class="flex gap-2 justify-between mt-2">
          <UButton
            color="info"
            label="Update"
            size="xs"
            @click.stop="
              editingSessionId = session.id;
              newSessionState.name = session.name;
              modalOpened = true
            "
          />
          <UButton
            v-if="!session.endTime"
            color="error"
            label="Stop"
            size="xs"
            @click.stop="stopSession(session.id)"
          />
        </div>
      </div>
    </NuxtLink>
  </div>
</div>
</template>
