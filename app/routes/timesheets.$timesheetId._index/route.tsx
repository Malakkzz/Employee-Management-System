import { getDB } from "~/db/getDB";
import { useLoaderData, Form, redirect, useNavigate } from "react-router";
import type { ActionFunction } from "react-router";

export async function loader({ params }: any) {
  const { timesheetId } = params;  // Get the timesheetId from the URL params
  const db = await getDB();
  
  // Fetch the timesheet data by ID
  const timesheet = await db.get('SELECT * FROM timesheets WHERE id = ?', [timesheetId]);

  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 });
  }

  const employees = await db.all('SELECT id, full_name FROM employees');

  return { timesheet, employees };
}


export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");

  const db = await getDB();

  // Update the existing timesheet based on timesheetId from the URL params
  await db.run(
    'UPDATE timesheets SET employee_id = ?, start_time = ?, end_time = ? WHERE id = ?',
    [employee_id, start_time, end_time, params.timesheetId] // Use the dynamic timesheetId here
  );

  return redirect("/timesheets");
}

export default function TimesheetPage() {
  const { timesheet, employees } = useLoaderData();

  return (
    <div>
      <h1>Update Timesheet</h1>
      <Form method="post">
        <div>
          <label htmlFor="employee_id">Employee</label>
          <select name="employee_id" id="employee_id" required>
            {employees.map((employee: any) => (
              <option 
                key={employee.id} 
                value={employee.id} 
                selected={timesheet?.employee_id === employee.id}
              >
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input 
            type="datetime-local" 
            name="start_time" 
            id="start_time" 
            defaultValue={timesheet?.start_time || ''} 
            required 
          />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input 
            type="datetime-local" 
            name="end_time" 
            id="end_time" 
            defaultValue={timesheet?.end_time || ''} 
            required 
          />
        </div>
        <button type="submit">Update Timesheet</button>
      </Form>
      <hr />
      <ul>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}
