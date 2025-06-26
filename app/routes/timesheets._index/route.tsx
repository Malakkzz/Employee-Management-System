import { useLoaderData, Link, useNavigate } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";

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
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Timesheets</h1>

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
                style={{
                  cursor: "pointer",
                  backgroundColor: "#fff",
                }}
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
        <div>
          <p>📅 Calendar view to be implemented using Schedule-X</p>
          <a
            href="https://schedule-x.dev/docs/frameworks/react"
            target="_blank"
            rel="noreferrer"
          >
            View Schedule-X docs
          </a>
        </div>
      )}

      <ul>
        <li>
          <Link to="/timesheets/new">New Timesheet</Link>
        </li>
        <li>
          <Link to="/employees">Employees</Link>
        </li>
      </ul>
    </div>
  );
}
