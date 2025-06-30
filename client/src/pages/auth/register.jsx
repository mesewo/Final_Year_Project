import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState(getPasswordChecks(""));
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  useEffect(() => {
    setPasswordChecks(getPasswordChecks(formData.password));
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  // Validation
  const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    else if (formData.userName.length < 3) newErrors.userName = "Username must be at least 3 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!Object.values(getPasswordChecks(formData.password)).every(Boolean))
      newErrors.password = "Password must meet all requirements below";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

// Registration submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      toast({
        title: "Validation failed",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register", {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      });
      if (response.data.success) {
        toast({
          title: "OTP Sent",
          description: "We've sent a 6-digit OTP to your email address.",
          variant: "success",
        });
        setShowOtpField(true);
        localStorage.setItem("pendingVerificationEmail", formData.email);
      } else {
        toast({
          title: "Registration Failed",
          description: response.data.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // OTP submit
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    if (!otp  || otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }
    const email = localStorage.getItem("pendingVerificationEmail") || formData.email;
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/verify-email-otp", { email, otp });
      if (response.data.success) {
        toast({ title: "Email verified! Redirecting to login..." });
        localStorage.removeItem("pendingVerificationEmail");
        setTimeout(() => navigate("/auth/login"), 1500);
      } else {
        setOtpError(response.data.message || "Verification failed");
      }
    } catch (err) {
      setOtpError(err?.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

// Resend OTP
  const handleResendOtp = async () => {
    const email = localStorage.getItem("pendingVerificationEmail") || formData.email;
    if (!email) {
      toast({
        title: "Error",
        description: "No email found to resend OTP.",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/resend-otp", { email });
      if (response.data.success) {
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to resend OTP.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to resend OTP.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Password strength bar color
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (!formData.password) return "";
    if (passwordStrength <= 1) return "Very Weak";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Moderate";
    if (passwordStrength <= 4) return "Strong";
    return "Very Strong";
  };

  const allPasswordRequirementsMet = Object.values(passwordChecks).every(Boolean);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto w-full max-w-xl px-4 py-12"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Join us Today
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
            to="/auth/login"
          >
            Sign in
          </Link>
        </p>
      </motion.div>

      {!showOtpField ? (
        <motion.form
          variants={containerVariants}
          onSubmit={handleRegister}
          className="mt-8 space-y-6"
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="userName" className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              value={formData.userName}
              onChange={e => setFormData({ ...formData, userName: e.target.value })}
              onBlur={() => handleBlur("userName")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
              placeholder="Your username"
            />
            {touched.userName && errors.userName && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.userName}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur("email")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all
duration-200"
              placeholder="name@example.com"
            />
            {touched.email && errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                onBlur={() => handleBlur("password")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {formData.password && (
              <div className="mt-3">
                <div className="flex items-center mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-500`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs font-medium text-gray-600">
                    {getPasswordStrengthText()}
                  </span>
                </div>
              </div>
            )}
            {touched.password && errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.password}
              </motion.p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${passwordChecks.length ? "bg-green-500" : "bg-gray-200"}`}>
                  {passwordChecks.length && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordChecks.length ? "text-gray-600" : "text-gray-400"}`}>8+ characters</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${passwordChecks.uppercase ? "bg-green-500" : "bg-gray-200"}`}>
                  {passwordChecks.uppercase && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordChecks.uppercase ? "text-gray-600" : "text-gray-400"}`}>Uppercase</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${passwordChecks.number ? "bg-green-500" : "bg-gray-200"}`}>
                  {passwordChecks.number && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordChecks.number ? "text-gray-600" : "text-gray-400"}`}>Number</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${passwordChecks.special ? "bg-green-500" : "bg-gray-200"}`}>
                  {passwordChecks.special && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${passwordChecks.special ? "text-gray-600" : "text-gray-400"}`}>Special char</span>
              </div>
            </div>
          </motion.div>

<motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                loading ||
                !formData.userName.trim() ||
                !formData.email.trim() ||
                !formData.password.trim() ||
                !allPasswordRequirementsMet ||
                Object.values(errors).some(Boolean)
              }
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center
                ${allPasswordRequirementsMet && !Object.values(errors).some(Boolean)
                ? "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg hover:shadow-primary/30"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
              `}
            >
              {isSubmitting || loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </motion.div>
        </motion.form>
      ) : (
        <motion.form
          variants={containerVariants}
          onSubmit={handleVerifyOtp}
          className="mt-8 space-y-6"
        >
          <motion.div variants={itemVariants}>
            <div className="mb-2">
              <span className="block text-sm text-muted-foreground">
                Please verify your email: <span className="font-semibold">{formData.email}</span>
              </span>
            </div>
            <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
              Enter OTP sent to your email
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
              placeholder="Enter OTP"
              maxLength={6}
              required
            />
            {otpError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {otpError}
              </motion.p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-medium bg-primary text-white"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              Didn't receive OTP? Resend
            </button>
          </motion.div>
        </motion.form>
      )}
    </motion.div>
  );
}