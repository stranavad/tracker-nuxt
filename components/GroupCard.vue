<script setup lang="ts">
import type {Group} from "~/types";
import z from 'zod';

defineProps<{
  group: Group
  showEmptyCreates: boolean;
}>();

const emit = defineEmits<{
  update: [],
  delete: [],
  deleteTeam: [number],
  updateTeam: [number],
  createTeam: [string],
  updateShowEmptyCreates: [boolean]
}>();

const newTeamSchema = z.object({
  name: z.string().min(1, "Team name is required")
})

const newTeam = ref({
  name: ''
})

function onNewTeamSubmit(event: FormSubmitEvent<z.infer<typeof newTeamSchema>>){
  emit('createTeam', event.data.name)
  newTeam.value.name = ''
}
</script>

<template>
<UCard>
    <template #header>
        <div class="flex justify-between items-center">
            <span>{{group.name}}</span>
            <div class="flex gap-2">
                <UButton icon="i-heroicons-pencil-square" variant="soft" @click="emit('update')"/>
                <UButton icon="i-heroicons-trash" variant="soft" color="error" @click="emit('delete')"/>
            </div>
        </div>
    </template>
    <div class="flex flex-wrap gap-2">
        <UCard
            v-for="team in group.teams"
            class="min-w-[250px]"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <span>{{team.name}}</span>
                    <div class="flex gap-2">
                        <UButton icon="i-heroicons-pencil-square" variant="soft" @click="emit('updateTeam', team.id)"/>
                        <UButton icon="i-heroicons-trash" variant="soft" color="error" @click="emit('deleteTeam', team.id)"/>
                    </div>
                </div>
            </template>
            <span class="text-sm">Team stats</span>
        </UCard>
        <UCard
            v-if="showEmptyCreates"
            class="min-w-[250px]"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <span>Create new team</span>
                    <UButton icon="i-heroicons-eye-slash-solid" variant="soft" color="neutral" @click="emit('updateShowEmptyCreates', false)"/>
                </div>
            </template>
            <UForm
                ref="form"
                class="flex gap-2"
                :schema="newTeamSchema"
                :state="newTeam"
                @submit="onNewTeamSubmit"
            >
                <UFormField name="name">
                    <UInput v-model="newTeam.name" placeholder="Name"/>
                </UFormField>
                <UButton type="submit" label="Create" variant="soft"/>
            </UForm>
        </UCard>
    </div>
</UCard>
</template>
