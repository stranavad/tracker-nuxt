<script setup lang="ts">
import {loraPresets} from '../data/lora'
import {type  DeviceSettings, deviceSettingsSchema } from '~/api/connect';

const deviceSettings = ref<DeviceSettings>({
  deviceId: "",
  interval: 15,
  display: true,
  encryption: false,
  encryptionKey: "",
  meshOwn: false,
  meshOther: false,
  hopLimit: 3,
  frequency: 868.25,
  outputPower: 27,
  loraBandwidth: 0,
  loraSpreadingFactor: 12 ,
  loraCodingRate: 4,
  loraPreambleLength: 8,
})

const selectedLoraPreset = ref<string>('LongFast')

function pickLoraPreset(presetLabel: string){
  selectedLoraPreset.value = presetLabel;
  const foundPreset = loraPresets.find((p) => p.label === presetLabel)

  if(!foundPreset){
    return
  }

  deviceSettings.value.loraBandwidth = foundPreset.loraBandwidth
  deviceSettings.value.loraSpreadingFactor = foundPreset.loraSpreadingFactor
  deviceSettings.value.loraSpreadingFactor = foundPreset.loraSpreadingFactor
  deviceSettings.value.loraCodingRate = foundPreset.loraCodingRate
  deviceSettings.value.loraPreambleLength = foundPreset.loraPreambleLength
}
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
        <span class="text-lg font-semibold">Radio settings</span>
        <USeparator/>
        <UFormField label="Frequency (MHz)" name="loraFrequency">
            <UInputNumber v-model="deviceSettings.frequency" class="w-full"/>
        </UFormField>
        <UFormField label="Output power (dBm)" name="loraOutputPower">
            <UInputNumber v-model="deviceSettings.outputPower" class="w-full"/>
        </UFormField>
    </div>
    <div class="flex flex-col gap-4 min-w-xl">
        <span class="text-lg font-semibold">Lora settings</span>
        <USeparator/>
        <UFormField label="Select Lora preset">
            <USelect
                value-key="label"
                :model-value="selectedLoraPreset"
                :items="loraPresets" class="w-full"
                @update:model-value="pickLoraPreset"
            />
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
