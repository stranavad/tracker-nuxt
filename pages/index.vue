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
import type {Device} from "~/types";

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
const showCreateSession = ref(false);
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

async function onSessionCreate(event: FormSubmitEvent<CreateSessionDto>): Promise<void>{
  await apiCreateSession(event.data);
  await refreshSessions();
  showCreateSession.value = false
}

/* Stop session */
async function stopSession(sessionId: number){
  await apiStopSession(sessionId);
  await refreshSessions();
}

async function navigate(path: string){
  await navigateTo(path)
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
      label="Create new group"
      variant="soft"
      :disabled="showCreateSession"
      @click="showCreateSession = true"
    />
  </div>
  <div class="flex flex-col gap-4">
      <UCard
        v-if="showCreateSession"
      >
          <template #header>
            <span>
                Create new session
            </span>
          </template>
          <UForm
            class="flex gap-2"
            :state="newSessionState"
            :schema="createSessionSchema"
            @submit="onSessionCreate"
          >
              <UFormField name="name">
                  <UInput v-model="newSessionState.name" placeholder="name"/>
              </UFormField>
              <UButton label="Create" variant="soft" type="submit"/>
              <UButton label="Cancel" variant="soft" color="error" @click="showCreateSession = false"/>
          </UForm>
      </UCard>
      <UCard
        v-for="session in sessions"
        @click="navigate(`/sessions/${session.id}`)"
      >
          <template #header>
            <div class="flex justify-between items-center">
                <div class="flex gap-2">
                    <span>{{session.name}}</span>
                    <UBadge v-if="!session.endTime" variant="soft">Active</UBadge>
                </div>
                <div class="flex gap-2">
                    <UButton
                        icon="i-heroicons-pencil-square"
                        color="info"
                        variant="soft"
                        @click.stop="
                          editingSessionId = session.id;
                          newSessionState.name = session.name;
                          modalOpened = true
                        "
                    />
                    <UButton
                        icon="i-heroicons-stop"
                        color="warning"
                        variant="soft"
                        :disabled="!!session.endTime"
                        @click.stop="stopSession(session.id)"
                    />
                    <UButton
                        icon="i-heroicons-trash"
                        variant="soft"
                        color="error"
                        @click.stop="stopSession(session.id)"
                    />
                </div>
            </div>
          </template>
          <div class="text-sm">
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
          </div>
      </UCard>
  </div>
</div>
</template>
