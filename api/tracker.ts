import {z} from "zod";

export function apiUpdateTracker(trackerId: string, data: UpdateTrackerDto): Promise<void>{
	const {$api} = useNuxtApp();
	return $api(`/tracker`, {
		method: "PUT",
		body: {
			id: trackerId,
			...data
		}
	})
}


export const updateTrackerSchema = z.object({
	name: z.string().min(2, "Tracker name must be at least 2 characters"),
	color: z.string()
})

export type UpdateTrackerDto = z.output<typeof updateTrackerSchema>
