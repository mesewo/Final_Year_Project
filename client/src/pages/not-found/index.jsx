import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {/* Animated floating SVG */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 animate-bounce-slow opacity-10"
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        style={{ zIndex: 0 }}
      >
        <circle cx="200" cy="200" r="180" fill="#3b82f6" />
        <circle cx="120" cy="120" r="60" fill="#2563eb" />
        <circle cx="300" cy="100" r="40" fill="#60a5fa" />
      </svg>

      {/* Animated 404 */}
      <h1 className="text-[7rem] font-extrabold text-blue-600 mb-2 z-10 animate-wiggle">
        404
      </h1>
      <p className="text-2xl font-semibold text-gray-700 mb-2 z-10 animate-fade-in">
        Oops! Page Not Found
      </p>
      <p className="text-gray-500 mb-6 z-10 animate-fade-in delay-200">
        The page you are looking for doesn't exist or has been moved.<br />
        But don’t worry, you can always go back home!
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition z-10 animate-fade-in delay-300"
      >
        Go Home
      </button>

      {/* Custom animations */}
      <style>
        {`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg) scale(1); }
            20% { transform: rotate(3deg) scale(1.05); }
            40% { transform: rotate(-2deg) scale(1.03); }
            60% { transform: rotate(2deg) scale(1.04); }
            80% { transform: rotate(-1deg) scale(1.02); }
          }
          .animate-wiggle {
            animation: wiggle 2s infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fadeIn 1s ease forwards;
            opacity: 0;
          }
          .animate-fade-in.delay-200 {
            animation-delay: 0.2s;
          }
          .animate-fade-in.delay-300 {
            animation-delay: 0.3s;
          }
          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(30px);}
          }
          .animate-bounce-slow {
            animation: bounceSlow 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}

export default NotFound;