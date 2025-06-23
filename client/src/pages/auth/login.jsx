// import CommonForm from "@/components/common/form";
// import { useToast } from "@/components/ui/use-toast";
// import { loginFormControls } from "@/config";
// import { loginUser } from "@/store/auth-slice";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";

// const initialState = {
//   email: "",
//   password: "",
// };

// function AuthLogin() {
//   const [formData, setFormData] = useState(initialState);
//   const dispatch = useDispatch();
//   const { toast } = useToast();
//   const navigate = useNavigate();


//   function onSubmit(event) {
//     event.preventDefault();

//     dispatch(loginUser(formData)).then((data) => {
//       const { payload } = data;
    
//       if (payload?.success) {
//         toast({
//           title: payload?.message || "Login successful",
//           variant: "default",
//         });

        

//       } else if (payload?.isBlocked) {
//         toast({
//           title: "Account Blocked",
//           description: payload?.message || "Your account is blocked. Please contact support.",
//           variant: "destructive",
//         });
//       } else {
//         toast({
//           title: payload?.message || "Login failed",
//           description: "Please check your credentials and try again.",
//           variant: "destructive",
//         });
//       }
//     });
    
//   }

//   return (
//     <div className="mx-auto w-full max-w-md space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">
//           Sign in to your account
//         </h1>
//         <p className="mt-2">
//           Don't have an account
//           <Link
//             className="font-medium ml-2 text-primary hover:underline"
//             to="/auth/register"
//           >
//             Register
//           </Link>
//         </p>
//       </div>
//       <CommonForm
//         formControls={loginFormControls}
//         buttonText={"Sign In"}
//         formData={formData}
//         setFormData={setFormData}
//         onSubmit={onSubmit}
//       />
//     </div>
//   );
// }

// export default AuthLogin;










import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, loginWithGoogle } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      const { payload } = data;
    
      if (payload?.success) {
        toast({
          title: payload?.message || "Login successful",
          variant: "default",
        });
        navigate("/");
      } else if (payload?.isBlocked) {
        toast({
          title: "Account Blocked",
          description: payload?.message || "Your account is blocked. Please contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: payload?.message || "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    });
  }

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    
    dispatch(loginWithGoogle({
      email: decoded.email,
      name: decoded.name,
      googleId: decoded.sub
    })).then((data) => {
      const { payload } = data;
      
      if (payload?.success) {
        toast({
          title: "Login successful with Google",
          variant: "default",
        });
        navigate("/");
      } else {
        toast({
          title: payload?.message || "Google login failed",
          variant: "destructive",
        });
      }
    });
  };

  const handleGoogleLoginFailure = () => {
    toast({
      title: "Google login failed",
      description: "Please try again or use another method",
      variant: "destructive",
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          useOneTap
        />
      </div>
      
      {/* <div className="text-center">
        <Link
          to="/auth/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div> */}
    </div>
  );
}

export default AuthLogin;