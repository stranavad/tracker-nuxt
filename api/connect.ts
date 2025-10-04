import { z } from 'zod';

export const loraSettings = z.object({
  loraBandwidth: z.number(),
  loraSpreadingFactor: z.number(),
  loraCodingRate: z.number(),
  loraPreambleLength: z.number(),
})

export const loraPresetSchema = loraSettings.extend({
  label: z.string()
})

export const deviceSettingsSchema = loraSettings.extend({
  deviceId: z.string(),
  interval: z.number(),
  display: z.boolean(),
  encryption: z.boolean(),
  encryptionKey: z.string(),
  meshOwn: z.boolean(),
  meshOther: z.boolean(),
  hopLimit: z.number(),
  frequency: z.number(),
  outputPower: z.number(),
})

export type LoraPreset = z.infer<typeof loraPresetSchema>
export type LoraSettings = z.infer<typeof loraSettings>
export type DeviceSettings = z.infer<typeof deviceSettingsSchema>;
