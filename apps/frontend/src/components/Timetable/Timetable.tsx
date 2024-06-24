import dayjs from "dayjs";
import { useMemo, useState } from "react";

import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import HourColumn from "./HourColumn";
import DayColumn from "./DayColumn";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import Event from "./types/Event";
import WeekPicker from "./WeekPicker";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

type Props = {
	events: Event[];
};

export default function Timetable({ events }: Props) {
	const [currentDate, setCurrentDate] = useState(dayjs());

	const startTime = dayjs("08:00", "HH:mm");
	const endTime = dayjs("18:00", "HH:mm");

	const weekDays = useMemo(() => {
		const startOfWeek = currentDate.startOf("isoWeek");

		return [...new Array(7)].map((_, i) => startOfWeek.add(i, "day"));
	}, [currentDate]);

	const eventPerDay = useMemo(() => {
		const startOfWeek = currentDate.startOf("isoWeek");

		return [...new Array(7)].map((_, i) => {
			const currentDateIteration = startOfWeek.add(i, "day");

			return events.filter((event) => {
				return (
					event.start.isSame(currentDateIteration, "day") ||
					event.end.isSame(currentDateIteration, "day")
				);
			});
		});
	}, [currentDate, events]);

	return (
		<div className="w-full h-full flex flex-col gap-4">
			{/* Header */}
			<div className="flex justify-between items-center">
				{/* Left */}
				<div className="flex gap-8">
					<button
						className="flex items-center border border-gray-900 font-medium px-2 py-1 rounded-md"
						onClick={() => setCurrentDate(dayjs())}
					>
						Today
					</button>

					<div className="flex gap-2">
						<button
							onClick={() =>
								setCurrentDate(currentDate.subtract(1, "week"))
							}
						>
							<TbChevronLeft />
						</button>
						<button
							onClick={() =>
								setCurrentDate(currentDate.add(1, "week"))
							}
						>
							<TbChevronRight />
						</button>
					</div>

					<WeekPicker
						currentDate={currentDate}
						onChange={(date) => setCurrentDate(dayjs(date))}
					/>
				</div>
			</div>
			{/* The Table */}
			<div className="flex">
				{/* Columns */}
				<HourColumn startTime={startTime} endTime={endTime} />
				{weekDays.map((day, i) => (
					<DayColumn
						key={day.format()}
						day={day}
						events={eventPerDay[i]}
						startTime={startTime}
						endTime={endTime}
					/>
				))}
			</div>
		</div>
	);
}
