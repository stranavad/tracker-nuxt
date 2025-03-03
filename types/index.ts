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
	rssi: number;
	snr: number;
	trackerId: string;
	sessionId: number;
}

export type TrackerRecordResponse = Pick<TrackerRecord, 'lat' | 'long'>;

export type TrackerResponse = Tracker & {latestRecord: null, firstRecord: null, records: TrackerRecordResponse[]} | Tracker & {latestRecord: TrackerRecord, firstRecord: TrackerRecord, records: TrackerRecordResponse[]}


export interface SessionResponse extends Session {
	trackers: TrackerResponse[]
}
