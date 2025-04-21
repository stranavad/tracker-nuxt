import type {ColorName} from "~/data/colors";

export interface Session {
	id: number;
	name: string;
	startTime: string;
	endTime: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface Tracker {
	id: string;
	name: ColorName;
}

export interface TrackerRecord {
	id: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	lat: number;
	long: number;
	trackerId: string;
	sessionId: number;
}

export type TrackerResponse = Tracker & {records: TrackerRecord[]}


export interface SessionResponse extends Session {
	trackers: TrackerResponse[]
}
