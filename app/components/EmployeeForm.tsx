// form component used to create or update an employee
//will be reused in both /employees/new and /employees/:id
import { Form } from "react-router";

//defaultValues: an object with employee data
export default function EmployeeForm({
  defaultValues,
}: {
  defaultValues?: any;
}) {
  const employee = defaultValues || {};

  return (
    <Form
      method="post"
      encType="multipart/form-data" //required to send file uploads
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name *</label>
        <input
          name="full_name"
          type="text"
          defaultValue={employee.full_name || ""}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          name="email"
          type="email"
          defaultValue={employee.email || ""}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          name="phone"
          type="tel"
          defaultValue={employee.phone || ""}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth *</label>
        <input
          name="date_of_birth"
          type="date"
          defaultValue={employee.date_of_birth || ""}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <input
          name="department"
          type="text"
          defaultValue={employee.department || ""}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          name="job_title"
          type="text"
          defaultValue={employee.job_title || ""}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Salary */}
      <div>
        <label className="block text-sm font-medium mb-1">Salary ($) *</label>
        <input
          name="salary"
          type="number"
          min="0"
          defaultValue={employee.salary || ""}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          name="start_date"
          type="date"
          defaultValue={employee.start_date || ""}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          name="end_date"
          type="date"
          defaultValue={employee.end_date || ""}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Employee Photo (jpg/png)
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-100 file:text-blue-700 file:rounded-md"
        />
      </div>

      {/* CV Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">
          CV (PDF/DOC)
        </label>
        <input
          type="file"
          name="cv"
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-100 file:text-blue-700 file:rounded-md"
        />
      </div>

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          💾 Save
        </button>
      </div>
    </Form>
  );
}
