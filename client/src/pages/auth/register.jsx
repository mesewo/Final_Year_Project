// import CommonForm from "@/components/common/form";
// import { useToast } from "@/components/ui/use-toast";
// import { registerFormControls } from "@/config";
// import { registerUser } from "@/store/auth-slice";
// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";

// const initialState = {
//   userName: "",
//   email: "",
//   password: "",
// };

// const initialErrors = {
//   userName: "",
//   email: "",
//   password: "",
// };

// function getPasswordChecks(password) {
//   return {
//     length: password.length >= 8,
//     uppercase: /[A-Z]/.test(password),
//     number: /\d/.test(password),
//     special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
//   };
// }

// function AuthRegister() {
//   const [formData, setFormData] = useState(initialState);
//   const [errors, setErrors] = useState(initialErrors);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [touched, setTouched] = useState({
//     email: false,
//     password: false,
//     userName: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordChecks, setPasswordChecks] = useState(getPasswordChecks(""));
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // Email validation
//   const validateEmail = (email) => {
//     const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     return re.test(String(email).toLowerCase());
//   };

//   // Password strength calculation
//   const calculatePasswordStrength = (password) => {
//     let strength = 0;
//     if (password.length >= 8) strength += 1;
//     if (password.length >= 12) strength += 1;
//     if (/[A-Z]/.test(password)) strength += 1;
//     if (/[0-9]/.test(password)) strength += 1;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 1;
//     return Math.min(strength, 5); // Max strength is 5
//   };

//   // Validate form fields
//   const validateForm = () => {
//     const newErrors = { ...initialErrors };
//     let isValid = true;

//     // Username validation
//     if (!formData.userName.trim()) {
//       newErrors.userName = "Username is required";
//       isValid = false;
//     } else if (formData.userName.length < 3) {
//       newErrors.userName = "Username must be at least 3 characters";
//       isValid = false;
//     }

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//       isValid = false;
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = "Please enter a valid email (e.g., name@gmail.com)";
//       isValid = false;
//     }

//     // Password validation
//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//       isValid = false;
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//       isValid = false;
//     } else if (
//       !(
//         passwordChecks.length &&
//         passwordChecks.uppercase &&
//         passwordChecks.number &&
//         passwordChecks.special
//       )
//     ) {
//       newErrors.password =
//         "Password must meet all requirements below.";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // Update password strength and checks when password changes
//   useEffect(() => {
//     setPasswordStrength(calculatePasswordStrength(formData.password));
//     setPasswordChecks(getPasswordChecks(formData.password));
//   }, [formData.password]);

//   const handleBlur = (field) => {
//     setTouched({ ...touched, [field]: true });
//     validateForm();
//   };

//   function onSubmit(event) {
//     event.preventDefault();

//     if (validateForm()) {
//       dispatch(registerUser(formData)).then((data) => {
//         // Check for email already exists error from backend
//         if (data?.payload?.message?.toLowerCase().includes("email") && data?.payload?.message?.toLowerCase().includes("exist")) {
//           setErrors((prev) => ({
//             ...prev,
//             email: "Email is already exist",
//           }));
//           toast({
//             title: "Email already exists",
//             description: "Please use a different email address.",
//             variant: "destructive",
//           });
//           return;
//         }
//         if (data?.payload?.success) {
//           toast({
//             title: data?.payload?.message || "Registration successful",
//             variant: "default",
//           });
//           navigate("/auth/login");
//         } else {
//           toast({
//             title: data?.payload?.message || "Registration failed",
//             description: "Please check your credentials and try again.",
//             variant: "destructive",
//           });
//         }
//       });
//     } else {
//       toast({
//         title: "Validation failed",
//         description: "Please fix the errors in the form",
//         variant: "destructive",
//       });
//     }
//   }

//   const getPasswordStrengthColor = () => {
//     if (passwordStrength <= 1) return "bg-red-500";
//     if (passwordStrength <= 3) return "bg-yellow-500";
//     return "bg-green-500";
//   };

//   const getPasswordStrengthText = () => {
//     if (!formData.password) return "";
//     if (passwordStrength <= 1) return "Very Weak";
//     if (passwordStrength <= 2) return "Weak";
//     if (passwordStrength <= 3) return "Moderate";
//     if (passwordStrength <= 4) return "Strong";
//     return "Very Strong";
//   };

//   // Add this derived value to check if all requirements are met
//   const allPasswordRequirementsMet =
//     passwordChecks.length &&
//     passwordChecks.uppercase &&
//     passwordChecks.number &&
//     passwordChecks.special;

//   const isFormValid =
//     formData.userName.trim().length >= 3 &&
//     validateEmail(formData.email) &&
//     formData.password.length >= 8 &&
//     allPasswordRequirementsMet;

//   return (
//     <div className="mx-auto w-full max-w-md space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">
//           Create new account
//         </h1>
//         <p className="mt-2">
//           Already have an account
//           <Link
//             className="font-medium ml-2 text-primary hover:underline"
//             to="/auth/login"
//           >
//             Login
//           </Link>
//         </p>
//       </div>
//       <form onSubmit={onSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="userName" className="block text-lg font-medium text-foreground">
//             Username
//           </label>
//           <input
//             id="userName"
//             name="userName"
//             type="text"
//             value={formData.userName}
//             onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
//             onBlur={() => handleBlur("userName")}
//             className="mt-2 block w-full rounded-md border border-input bg-background px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//           {touched.userName && errors.userName && (
//             <p className="mt-2 text-base text-red-600">{errors.userName}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="email" className="block text-lg font-medium text-foreground">
//             Email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             onBlur={() => handleBlur("email")}
//             className="mt-2 block w-full rounded-md border border-input bg-background px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="name@gmail.com"
//           />
//           {touched.email && errors.email && (
//             <p className="mt-2 text-base text-red-600">{errors.email}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-lg font-medium text-foreground">
//             Password
//           </label>
//           <input
//             id="password"
//             name="password"
//             type={showPassword ? "text" : "password"}
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             onBlur={() => handleBlur("password")}
//             className="mt-2 block w-full rounded-md border border-input bg-background px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           {/* Show password checkbox */}
//           <label className="flex items-center mt-3 text-base cursor-pointer select-none">
//             <input
//               type="checkbox"
//               checked={showPassword}
//               onChange={() => setShowPassword((v) => !v)}
//               className="mr-2"
//             />
//             Show password
//           </label>

//           {formData.password && (
//             <div className="mt-3">
//               <div className="flex space-x-2">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div
//                     key={i}
//                     className={`h-2 flex-1 rounded-full ${i <= passwordStrength ? getPasswordStrengthColor() : "bg-gray-200"}`}
//                   />
//                 ))}
//               </div>
//               <p
//                 className={`mt-2 text-base ${
//                   passwordStrength <= 2
//                     ? "text-red-600"
//                     : passwordStrength <= 3
//                     ? "text-yellow-600"
//                     : "text-green-600"
//                 }`}
//               >
//                 {getPasswordStrengthText()}
//               </p>
//             </div>
//           )}

//           {touched.password && errors.password && (
//             <p className="mt-2 text-base text-red-600">{errors.password}</p>
//           )}

//           {/* Dynamic password requirements */}
//           <div className="mt-3 text-base text-muted-foreground">
//             Password must contain:
//             <ul className="list-none pl-0 mt-2 space-y-2">
//               <li className="flex items-center">
//                 <span className={`mr-2 ${passwordChecks.length ? "text-green-600" : "text-gray-400"}`}>
//                   {passwordChecks.length ? "✔" : "✖"}
//                 </span>
//                 At least 8 characters
//               </li>
//               <li className="flex items-center">
//                 <span className={`mr-2 ${passwordChecks.uppercase ? "text-green-600" : "text-gray-400"}`}>
//                   {passwordChecks.uppercase ? "✔" : "✖"}
//                 </span>
//                 Uppercase letters
//               </li>
//               <li className="flex items-center">
//                 <span className={`mr-2 ${passwordChecks.number ? "text-green-600" : "text-gray-400"}`}>
//                   {passwordChecks.number ? "✔" : "✖"}
//                 </span>
//                 Numbers
//               </li>
//               <li className="flex items-center">
//                 <span className={`mr-2 ${passwordChecks.special ? "text-green-600" : "text-gray-400"}`}>
//                   {passwordChecks.special ? "✔" : "✖"}
//                 </span>
//                 Special characters
//               </li>
//             </ul>
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={!isFormValid}
//           className={`w-full rounded-md px-4 py-3 text-base font-semibold text-primary-foreground shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
//             ${isFormValid
//               ? "bg-primary hover:bg-primary/90"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`
//           }
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AuthRegister;












import { useToast } from "@/components/ui/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const initialErrors = {
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

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    userName: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState(getPasswordChecks(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const validateForm = () => {
    const newErrors = { ...initialErrors };
    let isValid = true;

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
      isValid = false;
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email (e.g., name@gmail.com)";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!allPasswordRequirementsMet) {
      newErrors.password = "Password must meet all requirements below";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
    setPasswordChecks(getPasswordChecks(formData.password));
  }, [formData.password]);

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const data = await dispatch(registerUser(formData));
        
        if (data?.payload?.message?.toLowerCase().includes("email") && 
            data?.payload?.message?.toLowerCase().includes("exist")) {
          setErrors((prev) => ({
            ...prev,
            email: "Email already exists",
          }));
          toast({
            title: "Email already exists",
            description: "Please use a different email address.",
            variant: "destructive",
          });
          return;
        }
        
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message || "Registration successful",
            variant: "default",
          });
          navigate("/auth/login");
        } else {
          toast({
            title: data?.payload?.message || "Registration failed",
            description: "Please check your credentials and try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Validation failed",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

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

  const allPasswordRequirementsMet =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.number &&
    passwordChecks.special;

  const isFormValid =
    formData.userName.trim().length >= 3 &&
    validateEmail(formData.email) &&
    formData.password.length >= 8 &&
    allPasswordRequirementsMet;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto w-full max-w-md px-4 py-12"
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

      <motion.form 
        variants={containerVariants}
        onSubmit={onSubmit} 
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
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={() => handleBlur("email")}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onBlur={() => handleBlur("password")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
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
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center
              ${isFormValid 
                ? "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg hover:shadow-primary/30"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isSubmitting ? (
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
    </motion.div>
  );
}

export default AuthRegister;