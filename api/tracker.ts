
export function apiUpdateTracker(trackerId: string, name: string): Promise<void>{
	const {$api} = useNuxtApp();
	return $api(`/tracker`, {
		method: "PUT",
		body: {
			id: trackerId,
			name
		}
	})
}
