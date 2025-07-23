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
	name: string;
	color: ColorName;
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
	trace: string;
	voltage: number;
	timestamp: number;
}

export interface TrackerResponse extends Tracker {
	records: TrackerRecord[];
}

export interface SessionResponse extends Session {
	trackers: TrackerResponse[]
}


export interface Device {
	id: string;
	name: string;
	color: string;
	records: DeviceHealth[]
}

export interface DeviceHealth {
	trace: string;
	timestamp: number;
	voltage: number;
}

/* MANAGE */
export interface Group {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	teams: Team[]
}

export interface Team {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}
