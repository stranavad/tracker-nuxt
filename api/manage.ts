import {z} from "zod";
import type {Group} from "~/types";

/* SCHEMA */
export const createGroupSchema = z.object({
	name: z.string()
})

export const createTeamSchema = z.object({
	name: z.string(),
	groupId: z.number()
})


export type CreateTeamDto = z.infer<typeof createTeamSchema>
export type CreateGroupDto = z.infer<typeof createGroupSchema>

/* API */

export function apiGetGroups(): Promise<Group[]>{
	const {$api} = useNuxtApp()
	return $api('/manage/all')
}

export function apiCreateGroup(data: CreateGroupDto): Promise<void>{
	const {$api} = useNuxtApp()

	return $api('/manage/group', {
		method: 'POST',
		body: data
	})
}

export function apiCreateTeam(data: CreateTeamDto): Promise<void>{
	const {$api} = useNuxtApp()

	return $api('manage/team', {
		method: 'POST',
		body: data
	})
}

export function apiUpdateGroup(data: CreateGroupDto, groupId: number): Promise<void>{
	const {$api} = useNuxtApp()
	return $api(`/manage/group`, {
		method: 'PUT',
		body: {
			...data,
			id: groupId
		}
	})
}
export function apiUpdateTeam(data: CreateTeamDto, teamId: number): Promise<void>{
	const {$api} = useNuxtApp()
	return $api(`/manage/team`, {
		method: 'PUT',
		body: {
			...data,
			id: teamId
		}
	})
}

export function apiDeleteGroup(groupId: number): Promise<void> {
	const {$api} = useNuxtApp()
	return $api(`/manage/group/${groupId}`, {
		method: 'DELETE',
	})
}

export function apiDeleteTeam(teamId: number): Promise<void> {
	const {$api} = useNuxtApp()
	return $api(`/manage/team/${teamId}`, {
		method: 'DELETE',
	})
}

