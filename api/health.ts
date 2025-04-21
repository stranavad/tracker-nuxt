import type {Device} from "~/types";

export function apiGetDevicesHealth(): Promise<Device[]>{
	const {$api} = useNuxtApp();
	return $api(`/health/all`)
}

export function apiGetTrackersHealth(): Promise<Device[]>{
	const {$api} = useNuxtApp();
	return $api(`/tracker/health`)
}
