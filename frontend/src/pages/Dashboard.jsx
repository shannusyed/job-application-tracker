import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Job Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-700">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="p-6">
        <p className="text-slate-600">Your applications will appear here soon.</p>
      </main>
    </div>
  );
}

export default Dashboard;