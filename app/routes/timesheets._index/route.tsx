import { useLoaderData, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";

// ----- loader ----------------------------------------------------------
export async function loader() {
  const db = await getDB();
  const timesheets = await db.all(`
    SELECT timesheets.*, employees.full_name
    FROM timesheets
    JOIN employees ON timesheets.employee_id = employees.id
  `);
  return { timesheets };
}

// ----- page ------------------------------------------------------------
export default function TimesheetsPage() {
  const { timesheets } = useLoaderData();
  const [view, setView] = useState<"table" | "calendar">("table");
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
  if (!datetime || typeof datetime !== 'string') {
    return ''; // If datetime is invalid, return an empty string
  }

  const [date, time] = datetime.trim().split(' ');

  // If time is missing, or the time is empty, return empty string
  if (!time || time.length !== 5) {
    return ''; 
  }

  const normalizedTime = time.length === 5 ? time + ':00' : time;
  return `${date} ${normalizedTime}`; // Return the full format: YYYY-MM-DD HH:mm:ss
}


  useEffect(() => {
  const events = timesheets.map((ts: any) => {
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
  }).filter(Boolean); // Remove any null events

  console.log('Valid events:', events);
  eventsService.set(events);
}, [timesheets, eventsService]);



  return (
    <div style={{ padding: "2rem" }}>
      <h1>Timesheets</h1>
      <ul style={{ marginTop: "2rem" }}>
        <li>
          <Link to="/timesheets/new">New Timesheet</Link>
        </li>
        <li>
          <Link to="/employees">Employees</Link>
        </li>
      </ul>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("table")}>📋 Table View</button>
        <button onClick={() => setView("calendar")}>📆 Calendar View</button>
      </div>

      {view === "table" ? (
        <table
          border={1}
          cellPadding={10}
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th>Timesheet #</th>
              <th>Employee</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((ts: any) => (
              <tr
                key={ts.id}
                onClick={() => navigate(`/timesheets/${ts.id}`)}
                style={{ cursor: "pointer", backgroundColor: "#fff" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff")
                }
              >
                <td>{ts.id}</td>
                <td>{ts.full_name}</td>
                <td>{ts.start_time}</td>
                <td>{ts.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="sx-react-calendar-wrapper" style={{ height: "700px" }}>
          <ScheduleXCalendar calendarApp={calendarApp} />
        </div>
      )}
    </div>
  );
}
