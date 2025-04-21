import type {UpdateTrackerDto} from "~/api/tracker";

export function apiUpdateDevice(deviceId: string, data: UpdateTrackerDto): Promise<void>{
	const {$api} = useNuxtApp();
	return $api(`/health/device`, {
		method: "PUT",
		body: {
			id: deviceId,
			...data
		}
	})
}
