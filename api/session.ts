import type {Session, SessionResponse} from "~/types";
import {z} from "zod";

export function apiGetSessionById(sessionId: number): Promise<SessionResponse>{
	const {$api} = useNuxtApp();
	return $api(`/session/${sessionId}`)
}

export function apiListSessions(): Promise<Session[]>{
	const {$api} = useNuxtApp()
	return $api('/session/list')
}


export const createSessionSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(25, "Name must be 25 characters at most")
})

export type CreateSessionDto = z.output<typeof createSessionSchema>

export function apiCreateSession(data: CreateSessionDto): Promise<Session> {
	const {$api} = useNuxtApp()
	return $api('/session', {
		method: 'POST',
		body: data
	})
}

export function apiUpdateSession(data: CreateSessionDto, sessionId: number): Promise<Session>{
	const {$api} = useNuxtApp()
	return $api(`/session/${sessionId}`, {
		method: 'PUT',
		body: data
	})
}

export function apiStopSession(sessionId: number): Promise<void>{
	const {$api} = useNuxtApp()
	return $api(`/session/stop/${sessionId}`, {
		method: 'POST'
	})
}


export function apiResetSessionTracker(sessionId: number, trackerId: string): Promise<void>{
	const {$api} = useNuxtApp();
	return $api(`/session/reset-tracker`, {
		method: 'POST',
		body: {
			sessionId,
			trackerId
		}
	})
}


export function apiUpdateTeamToTracker(sessionId: number, teamId: number, trackerId: string): Promise<void>{
	const {$api} = useNuxtApp()
	return $api(`/session/team-to-tracker`, {
		method: 'POST',
		body: {
			sessionId,
			trackerId,
			teamId
		}
	})
}
