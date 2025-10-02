<script setup lang="ts">
import z from 'zod';

const deviceSettingsSchema = z.object({
  deviceId: z.string(),
  interval: z.number(),
  display: z.boolean(),
  encryption: z.boolean(),
  encryptionKey: z.string(),
  meshOwn: z.boolean(),
  meshOther: z.boolean(),
  hopLimit: z.number(),
  loraFrequency: z.number(),
  loraOutputPower: z.number(),
  loraBandwidth: z.number(),
  loraSpreadingFactor: z.number(),
  loraCodingRate: z.number(),
  loraPreambleLength: z.number(),
})

const deviceSettings = ref<z.infer<typeof deviceSettingsSchema>>({
  deviceId: "",
  interval: 15,
  display: true,
  encryption: false,
  encryptionKey: "",
  meshOwn: false,
  meshOther: false,
  hopLimit: 3,
  loraFrequency: 868.25,
  loraOutputPower: 27,
  loraBandwidth: 0,
  loraSpreadingFactor: 12 ,
  loraCodingRate: 4,
  loraPreambleLength: 8,
})
</script>
<template>
<UForm
    class="flex flex-wrap gap-8"
    :state="deviceSettings"
    :schema="deviceSettingsSchema"
>
    <div class="flex flex-col gap-4 min-w-xl">
        <span class="text-lg font-semibold">Device settings</span>
        <USeparator/>
        <UFormField label="Device ID" name="deviceId">
            <UInput v-model="deviceSettings.deviceId" placeholder="t01" class="w-full"/>
        </UFormField>
        <UFormField label="Interval (seconds)" name="interval">
            <UInputNumber v-model="deviceSettings.interval" class="w-full"/>
        </UFormField>
        <UFormField label="Display on/off" name="display">
            <USwitch v-model="deviceSettings.display" />
        </UFormField>
        <UFormField label="Encryption" name="encryption">
            <USwitch v-model="deviceSettings.encryption" />
        </UFormField>
        <UFormField
            label="Encryption key"
            name="encryptionKey"
        >
            <UTextarea v-model="deviceSettings.encryptionKey" :disabled="!deviceSettings.encryption" placeholder="Encryption key" class="w-full"/>
        </UFormField>
    </div>
    <div class="flex flex-col gap-4 min-w-xl">
        <span class="text-lg font-semibold">Meshing</span>
        <USeparator/>
        <UFormField label="Allow meshing to device packets" name="meshOwn">
            <USwitch v-model="deviceSettings.meshOwn" />
        </UFormField>
        <UFormField label="Hop limit" name="hopLimit">
            <UInputNumber v-model="deviceSettings.hopLimit" :disabled="!deviceSettings.meshOwn" class="w-full"/>
        </UFormField>
        <UFormField label="Re-broadcast packets of other trackers" name="meshOther">
            <USwitch v-model="deviceSettings.meshOther" />
        </UFormField>
    </div>
    <div class="flex flex-col gap-4 min-w-xl">
        <span class="text-lg font-semibold">Lora settings</span>
        <USeparator/>
        <UFormField label="Frequency (MHz)" name="loraFrequency">
            <UInputNumber v-model="deviceSettings.loraFrequency" class="w-full"/>
        </UFormField>
        <UFormField label="Output power (dBm)" name="loraOutputPower">
            <UInputNumber v-model="deviceSettings.loraOutputPower" class="w-full"/>
        </UFormField>
        <UFormField label="Bandwidth" name="loraBandwidth">
            <UInputNumber v-model="deviceSettings.loraBandwidth" class="w-full"/>
        </UFormField>
        <UFormField label="Spreading factor" name="loraSpreadingFactor">
            <UInputNumber v-model="deviceSettings.loraSpreadingFactor" class="w-full"/>
        </UFormField>
        <UFormField label="Error coding rate" name="loraCodingRate">
            <UInputNumber v-model="deviceSettings.loraCodingRate" class="w-full"/>
        </UFormField>
        <UFormField label="Preamble length" name="loraPreambleLength">
            <UInputNumber v-model="deviceSettings.loraPreambleLength" class="w-full"/>
        </UFormField>
    </div>
</UForm>
</template>
