const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

function ApplicationCard({ application, onStatusChange, onDelete }) {
  const { id, company, role, status, job_link, salary, notes, applied_date } = application;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-800">{company}</h3>
      <p className="text-sm text-slate-600">{role}</p>

      {salary && <p className="text-xs text-slate-500 mt-1">💰 {salary}</p>}
      {applied_date && (
        <p className="text-xs text-slate-500">
          📅 {new Date(applied_date).toLocaleDateString()}
        </p>
      )}
      {notes && <p className="text-xs text-slate-500 mt-2 italic">{notes}</p>}

      {job_link && (
        <a
          href={job_link}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-600 hover:underline block mt-2"
        >
          View job posting
        </a>
      )}

      <div className="flex items-center justify-between mt-3 gap-2">
        <select
          value={status}
          onChange={(e) => onStatusChange(id, e.target.value)}
          className="text-xs border border-slate-300 rounded-md p-1.5"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button
          onClick={() => onDelete(id)}
          className="text-xs text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ApplicationCard;