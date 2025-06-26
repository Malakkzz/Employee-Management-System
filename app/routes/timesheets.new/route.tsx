import { useLoaderData, Form, redirect, useNavigate } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader({ params }: any) {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  let timesheet = null;
  if (params.id) {
    // Fetch existing timesheet if updating
    timesheet = await db.get('SELECT * FROM timesheets WHERE id = ?', [params.id]);
  }
  return { employees, timesheet };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");

  const db = await getDB();

  if (params.id) {
    // Update existing timesheet
    await db.run(
      'UPDATE timesheets SET employee_id = ?, start_time = ?, end_time = ? WHERE id = ?',
      [employee_id, start_time, end_time, params.id]
    );
  } else {
    // Create new timesheet
    await db.run(
      'INSERT INTO timesheets (employee_id, start_time, end_time) VALUES (?, ?, ?)',
      [employee_id, start_time, end_time]
    );
  }

  return redirect("/timesheets");
}

export default function TimesheetFormPage() {
  const { employees, timesheet } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div>
      <h1>{timesheet ? "Update Timesheet" : "Create New Timesheet"}</h1>
      <Form method="post">
        <div>
          <label htmlFor="employee_id">Employee</label>
          <select name="employee_id" id="employee_id" required>
            {employees.map((employee: any) => (
              <option key={employee.id} value={employee.id} selected={timesheet?.employee_id === employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input type="datetime-local" name="start_time" id="start_time" defaultValue={timesheet?.start_time || ''} required />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input type="datetime-local" name="end_time" id="end_time" defaultValue={timesheet?.end_time || ''} required />
        </div>
        <button type="submit">{timesheet ? "Update Timesheet" : "Create Timesheet"}</button>
      </Form>
      <hr />
      <ul>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}
