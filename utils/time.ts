export function getTimeDifference(date1: string, date2: string) {
	const dayjs = useDayjs()

	const diff = dayjs(date1).diff(dayjs(date2));
	const duration = dayjs.duration(diff);

	const hours = Math.floor(duration.asHours());
	const minutes = duration.minutes();

	return `${hours}h ${minutes}m`;
}
