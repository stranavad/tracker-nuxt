<script setup lang="ts">
import {type CreateTeamDto, createTeamSchema} from "~/api/manage";
import type {FormSubmitEvent} from "#ui/types";
import type {Group} from "~/types";

const open = defineModel<boolean>('open')
defineProps<{
  groups: Group[]
  teamId: number | null
}>()

const emit = defineEmits<{
  submit: [CreateTeamDto]
}>();

const state = ref<CreateTeamDto>({
  name: '',
  groupId: 0
})

function onSubmit(event: FormSubmitEvent<CreateTeamDto>){
  emit('submit', event.data)
}

watch(() => open.value, () => {
  state.value.name = ''
})

</script>

<template>
  <UModal
      v-model:open="open"
      :title="teamId ? 'Update team' : 'Create team'"
  >
    <template
        #body
    >
      <UForm
          class="space-y-4"
          :state="state"
          :schema="createTeamSchema"
          @submit="onSubmit"
      >
        <UFormField
            label="Name"
            name="name"
            class="w-full"
        >
          <UInput v-model="state.name" placeholder="AC" class="w-full"/>
        </UFormField>
        <UFormField
          label="Group"
          name="groupId"
          class="w-full"
        >
          <USelect
            v-model="state.groupId"
            :items="groups"
            label-key='name'
            value-key="id"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit" size="sm" :label="teamId ? 'Update' : 'Create'"/>
      </UForm>
    </template>
  </UModal>
</template>
