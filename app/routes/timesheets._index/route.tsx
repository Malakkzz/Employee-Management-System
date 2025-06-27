import { useLoaderData, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
export async function loader() {
  const db = await getDB();
  const timesheets = await db.all(`
    SELECT timesheets.*, employees.full_name
    FROM timesheets
    JOIN employees ON timesheets.employee_id = employees.id
  `);
  return { timesheets };
}

export default function TimesheetsPage() {
  const { timesheets } = useLoaderData();
  const [view, setView] = useState<"table" | "calendar">("table");
  const [searchQuery, setSearchQuery] = useState<string>(""); // New state for search query
  const navigate = useNavigate();

  // events service plugin
  const eventsService = useState(() => createEventsServicePlugin())[0];

  // calendar instance
  const calendarApp = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    plugins: [eventsService],
  });

  const formatToScheduleX = (datetime: string) => {
    if (!datetime || typeof datetime !== "string") {
      return ""; // If datetime is invalid, return an empty string
    }

    const [date, time] = datetime.trim().split(" ");

    // If time is missing, or the time is empty, return empty string
    if (!time || time.length !== 5) {
      return "";
    }

    const normalizedTime = time.length === 5 ? time + ":00" : time;
    return `${date} ${normalizedTime}`; // Return the full format: YYYY-MM-DD HH:mm:ss
  };

  useEffect(() => {
    const events = timesheets
      .map((ts: any) => {
        const start = formatToScheduleX(ts.start_time);
        const end = formatToScheduleX(ts.end_time);

        // Only include valid events (non-empty start and end)
        if (!start || !end) {
          return null; // Skip invalid events
        }

        return {
          id: ts.id.toString(),
          title: ts.full_name,
          start,
          end,
        };
      })
      .filter(Boolean); // Remove any null events

    console.log("Valid events:", events);
    eventsService.set(events);
  }, [timesheets, eventsService]);

  // Filter timesheets based on the search query
  const filteredTimesheets = timesheets.filter((ts: any) =>
    ts.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Timesheets</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by employee"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md"
        />
      </div>

      <ul className="flex gap-6 mb-6 text-blue-600 underline font-medium">
        <li>
          <Link to="/timesheets/new">➕ New Timesheet</Link>
        </li>
        <li>
          <Link to="/employees">👥 Employees</Link>
        </li>
      </ul>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${view === "table" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setView("table")}
        >
          📋 Table View
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "calendar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setView("calendar")}
        >
          📆 Calendar View
        </button>
      </div>

      {view === "table" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left border-b">Timesheet #</th>
                <th className="p-3 text-left border-b">Employee</th>
                <th className="p-3 text-left border-b">Start</th>
                <th className="p-3 text-left border-b">End</th>
                <th className="p-3 text-left border-b">Summary</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimesheets.map((ts: any) => (
                <tr
                  key={ts.id}
                  onClick={() => navigate(`/timesheets/${ts.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-3 border-b">{ts.id}</td>
                  <td className="p-3 border-b">{ts.full_name}</td>
                  <td className="p-3 border-b">{ts.start_time}</td>
                  <td className="p-3 border-b">{ts.end_time}</td>
                  <td className="p-3 border-b">{ts.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="sx-react-calendar-wrapper h-[700px]">
          <ScheduleXCalendar calendarApp={calendarApp} />
        </div>
      )}
    </div>
  );
}
