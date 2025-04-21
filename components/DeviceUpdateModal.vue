<script setup lang="ts">
import type {Device} from "~/types";
import {type UpdateTrackerDto, updateTrackerSchema} from "~/api/tracker";
import type {FormSubmitEvent} from "#ui/types";

const props = defineProps<{
  device: Device
}>();

const emit = defineEmits<{
  submit: [data: UpdateTrackerDto]
}>();

const open = defineModel<boolean>('open')
const state = reactive<UpdateTrackerDto>({
  name: '',
  color: ''
});

watch(() => props.device, (newDevice) => {
  state.name = newDevice.name;
  state.color = newDevice.color;
})

function onSubmit(event: FormSubmitEvent<UpdateTrackerDto>){
  emit('submit', event.data)
}

</script>

<template>
<UModal
  v-model:open="open"
  :title="`Update device - ${device.id}`"
>
  <template #body>
    <UForm
      class="space-y-4"
      :state="state"
      :schema="updateTrackerSchema"
      @submit="onSubmit"
    >
      <UFormField label="Name" name="name" class="w-full">
        <UInput v-model="state.name" placeholder="Tracker XX"/>
      </UFormField>
      <UFormField label="Color" name="color">
        <UColorPicker v-model="state.color"/>
      </UFormField>
      <UButton
        type="submit"
        size="sm"
        label="Update"
      />
    </UForm>
  </template>
</UModal>
</template>
