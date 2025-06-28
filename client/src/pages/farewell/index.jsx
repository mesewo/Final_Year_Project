import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Farewell() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 relative overflow-hidden">
      {/* Animated heartbroken emoji */}
      <div className="mb-6 animate-bounce-slow z-10">
        <span className="text-[6rem] select-none" role="img" aria-label="heartbroken">
          💔
        </span>
      </div>
      <h1 className="text-3xl font-bold text-blue-700 mb-2 z-10 animate-fade-in">
        We're sad to see you go!
      </h1>
      <p className="text-lg text-gray-700 mb-4 z-10 animate-fade-in delay-200 text-center max-w-xl">
        Your account has been deleted. Thank you for being part of our journey.<br />
        If you ever change your mind, our doors are always open for you.
      </p>
      <p className="text-gray-400 text-sm z-10 animate-fade-in delay-400">
        Redirecting you to the homepage...
      </p>
      {/* Confetti animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%">
          <g className="animate-confetti">
            {[...Array(30)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100 + "%"}
                cy={Math.random() * 100 + "%"}
                r={Math.random() * 6 + 2}
                fill={`hsl(${Math.random() * 360}, 80%, 60%)`}
                opacity="0.7"
              />
            ))}
          </g>
        </svg>
      </div>
      <style>
        {`
          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(20px);}
          }
          .animate-bounce-slow {
            animation: bounceSlow 2.5s infinite;
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
          .animate-fade-in.delay-400 {
            animation-delay: 0.4s;
          }
          @keyframes confetti {
            0% { transform: translateY(0);}
            100% { transform: translateY(100vh);}
          }
          .animate-confetti circle {
            animation: confetti 10s linear infinite;
          }
        `}
      </style>
    </div>
  );
}