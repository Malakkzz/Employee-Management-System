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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Employees</h1>

      {/* navigation */}
      <nav className="flex gap-6 mb-6 text-blue-600 font-medium underline">
        <Link to="/employees/new">➕ New Employee</Link>
        <Link to="/timesheets">📅 Timesheets</Link>
      </nav>
      <h3 className="text-lg font-medium mb-4">Click on an employee to edit it!</h3>

      {/* live search + department filter */}
      {/* didn't use forms or submissions, just react state */}
       <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full max-w-xs"
        />

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full max-w-xs"
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left border-b">ID</th>
              <th className="p-3 text-left border-b">Full Name</th>
              <th className="p-3 text-left border-b">Email</th>
              <th className="p-3 text-left border-b">Phone</th>
              <th className="p-3 text-left border-b">Department</th>
            </tr>
          </thead>
          <tbody>
          {filteredEmployees.map((e: any) => (
            //this allows the whole row to be clickable with a little styling 
            <tr
              key={e.id}
              onClick={() => navigate(`/employees/${e.id}`)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="p-3 border-b">{e.id}</td>
                <td className="p-3 border-b">{e.full_name}</td>
                <td className="p-3 border-b">{e.email || "-"}</td>
                <td className="p-3 border-b">{e.phone || "-"}</td>
                <td className="p-3 border-b">{e.department || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
