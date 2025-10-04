import type { LoraPreset } from "~/api/connect";

export const loraPresets: LoraPreset[] = [
  {
    label: 'LongSlow',
    loraBandwidth: 250,
    loraSpreadingFactor: 12,
    loraCodingRate: 0, // ??
    loraPreambleLength: 0 // ??
  },
  {
    label: 'LongFast',
    loraBandwidth: 250,
    loraSpreadingFactor: 11,
    loraCodingRate: 0, // ??
    loraPreambleLength: 0 // ??
  },
  {
    label: 'MediumSlow',
    loraBandwidth: 250,
    loraSpreadingFactor: 10,
    loraCodingRate: 0, // ??
    loraPreambleLength: 0 // ??
  },
  {
    label: 'MediumFast',
    loraBandwidth: 250,
    loraSpreadingFactor: 9,
    loraCodingRate: 0, // ??
    loraPreambleLength: 0 // ??
  },
  {
    label: 'ShortSlow',
    loraBandwidth: 250,
    loraSpreadingFactor: 8,
    loraCodingRate: 0, // ??
    loraPreambleLength: 0 // ??
  },
  {
    label: 'ShortFast',
    loraBandwidth: 250,
    loraSpreadingFactor: 7,
    loraCodingRate: 0, // ??
    loraPreambleLength: 0 // ??
  },
  {
    label: 'ShortTurbo',
    loraBandwidth: 500,
    loraSpreadingFactor: 7,
    loraCodingRate: 0, // ??
    loraPreambleLength: 0 // ??
  },
]
