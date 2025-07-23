<script setup lang="ts">
import {type CreateGroupDto, createGroupSchema} from "~/api/manage";
import type {FormSubmitEvent} from "#ui/types";

const open = defineModel<boolean>('open')
defineProps<{
  groupId: number | null
}>()

const emit = defineEmits<{
  submit: [CreateGroupDto]
}>();

const state = ref<CreateGroupDto>({
  name: ''
})

function onSubmit(event: FormSubmitEvent<CreateGroupDto>){
  emit('submit', event.data)
}

watch(() => open.value, () => {
  state.value.name = ''
})

</script>

<template>
<UModal
  v-model:open="open"
  :title="groupId ? 'Update group' : 'Create group'"
>
  <template
    #body
  >
   <UForm
     class="space-y-4"
    :state="state"
    :schema="createGroupSchema"
     @submit="onSubmit"
   >
     <UFormField
      label="Name"
      name="name"
      class="w-full"
     >
       <UInput v-model="state.name" placeholder="AC"/>
     </UFormField>
     <UButton type="submit" size="sm" :label="groupId ? 'Update' : 'Create'"/>
   </UForm>
  </template>
</UModal>
</template>
