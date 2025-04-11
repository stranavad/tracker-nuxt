export const trackerColorsMap = {
	red: 'bg-red-500',
	orange: 'bg-orange-500',
	lime: 'bg-lime-500',
	teal: 'bg-teal-500',
	indigo: 'bg-indigo-500',
	violet: 'bg-violet-500',
	pink: 'bg-pink-500',
	rose: 'bg-rose-500',
	gray: 'bg-gray-500',
	fuchsia: 'bg-fuchsia-500',
} as const;

export const trackerColorStrokeMap: {[k in keyof typeof trackerColorsMap]: string} = {
	red: 'stroke-red-500',
	orange: 'stroke-orange-500',
	lime: 'stroke-lime-500',
	teal: 'stroke-teal-500',
	indigo: 'stroke-indigo-500',
	violet: 'stroke-violet-500',
	pink: 'stroke-pink-500',
	rose: 'stroke-rose-500',
	gray: 'stroke-gray-500',
	fuchsia: 'stroke-fuchsia-500',
}

export type ColorName = keyof typeof trackerColorsMap

export const trackerColors = Object.keys(trackerColorsMap) as ColorName[]
