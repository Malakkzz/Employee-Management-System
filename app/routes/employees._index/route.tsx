//useLoaderData(): Used to access data returned from the loader on this route.
//useSearchParams: Used to read/update URL query parameters.
import { useLoaderData, Link, Form, useSearchParams } from "react-router";
import { getDB } from "~/db/getDB"; //Custom helper to access the SQLite database.
import type { LoaderFunctionArgs } from "react-router"; //LoaderFunctionArgs: A type that defines what the loader function receives (like request, params, etc..)

//this function to fetch employee data from database
export async function loader({ request }: LoaderFunctionArgs) {
  const db = await getDB();

  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.toLowerCase() || "";

  //query to fetch all employees
  const employees = await db.all("SELECT * FROM employees");

  const filteredEmployees = employees.filter((e) =>
    e.full_name.toLowerCase().includes(search)
  );

  //Returns filtered employees and the search value to the component.
  return { employees: filteredEmployees, search };
}

export default function EmployeesPage() {
  const { employees, search } = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Employees</h1>

      <nav style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/employees/new">➕ New Employee</Link>
        <Link to="/timesheets">📅 Timesheets</Link>
      </nav>

      {/* Bonus Search Bar */}
      <Form method="get" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          name="search"
          placeholder="Search by name..."
          defaultValue={search}
        />
        <button type="submit">Search</button>
      </Form>

      {/* Employees Table */}
      <table
        border={1}
        cellPadding={8}
        cellSpacing={0}
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Job Title</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: any) => (
            <tr key={employee.id}>
              <td>
                <Link to={`/employees/${employee.id}`}>{employee.id}</Link>
              </td>
              <td>{employee.full_name}</td>
              <td>{employee.email || "-"}</td>
              <td>{employee.phone || "-"}</td>
              <td>{employee.job_title || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </div>
  );
}
