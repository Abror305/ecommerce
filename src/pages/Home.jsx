import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <h1 className="text-4xl font-bold mb-6">Welcome to Home Page 🎉</h1>
      <button onClick={handleLogout} className="btn btn-error">
        Logout
      </button>
    </div>
  );
}
