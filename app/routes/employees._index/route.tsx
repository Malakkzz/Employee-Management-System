//useLoaderData(): Used to access data returned from the loader on this route.
import { useLoaderData, Link, useNavigate } from "react-router";
import { getDB } from "~/db/getDB"; //custom helper to access the SQLite database.
import type { LoaderFunctionArgs } from "react-router"; //LoaderFunctionArgs: A type that defines what the loader function receives (like request, params, etc..)
import { useState, useMemo } from "react";

//this function to fetch employee data from database
export async function loader({ request }: LoaderFunctionArgs) {
  const db = await getDB();

  //query to fetch all employees
  const employees = await db.all("SELECT * FROM employees");

  //xtraction of unique department names for the dropdown
  const departments = [
    ...new Set(employees.map((e) => e.department).filter(Boolean)),
  ];

  //returns both employees and departments to the component
  return {
    employees,
    departments,
  };
}

export default function EmployeesPage() {
  const { employees, departments } = useLoaderData(); //get employees and departments from the loader
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const navigate = useNavigate();


  //function to filter employees every time search term or department changes
  //used useMemo to optimize performance by recalculating only when dependencies change
  const filteredEmployees = useMemo(() => {
    return employees.filter((e: any) => {
      const nameMatch = e.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const deptMatch = selectedDepartment
        ? e.department === selectedDepartment
        : true;
      return nameMatch && deptMatch;
    });
  }, [employees, searchTerm, selectedDepartment]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Employees</h1>

      {/* navigation */}
      <nav style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/employees/new">➕ New Employee</Link>
        <Link to="/timesheets">📅 Timesheets</Link>
      </nav>
      <h3>Click on an employee to edit it!</h3>

      {/* live search + department filter */}
      {/* didn't use forms or submissions, just react state */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} //updates state immediately
        />

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept: string) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* employee table */}
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
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((e: any) => (
            //this allows the whole row to be clickable with a little styling 
            <tr
              key={e.id}
              onClick={() => navigate(`/employees/${e.id}`)}
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
              <td>{e.id}</td>
              <td>{e.full_name}</td>
              <td>{e.email || "-"}</td>
              <td>{e.phone || "-"}</td>
              <td>{e.department || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
