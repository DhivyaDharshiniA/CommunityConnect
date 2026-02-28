import { Link } from "react-router-dom";

export default function NgoSidebar() {
  return (
    <div className="w-64 bg-white shadow-md h-screen p-5 space-y-4">
      <h2 className="text-xl font-bold text-green-600">
        NGO Panel
      </h2>

      <Link to="/ngo/dashboard" className="block hover:text-green-600">
        Dashboard
      </Link>

      <Link to="/ngo/events" className="block hover:text-green-600">
        Manage Events
      </Link>

      <Link to="/ngo/volunteers" className="block hover:text-green-600">
        Volunteers
      </Link>
    </div>
  );
}