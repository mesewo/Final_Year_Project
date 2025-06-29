import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSellerUsername,
  updateSellerPassword,
} from "@/store/seller/settings-slice";
import { setUser } from "@/store/auth-slice";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Copy as CopyIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}
function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return Math.min(strength, 5);
}

export default function SellerSettings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.userName || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setUsername(user?.userName || "");
  }, [user?.userName]);

  // Password strength and checks
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState(getPasswordChecks(""));
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
    setPasswordChecks(getPasswordChecks(newPassword));
  }, [newPassword]);

  const allPasswordRequirementsMet =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.number &&
    passwordChecks.special;

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmNewPassword.length > 0 &&
    newPassword === confirmNewPassword;

  const canChangePassword =
    oldPassword &&
    newPassword &&
    confirmNewPassword &&
    allPasswordRequirementsMet &&
    passwordsMatch;

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (!newPassword) return "";
    if (passwordStrength <= 1) return "Very Weak";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Moderate";
    if (passwordStrength <= 4) return "Strong";
    return "Very Strong";
  };

  const handleChangeUsername = async () => {
    if (!username.trim()) {
      toast({ title: "Username cannot be empty", variant: "destructive" });
      return;
    }
    const res = await dispatch(updateSellerUsername({ userId: user.id, newUsername: username }));
    if (res.meta.requestStatus === "fulfilled" && res.payload) {
      dispatch(setUser(res.payload));
      toast({ title: "Username updated!", variant: "default" });
    }
  };

  const handleCopyPassword = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      toast({ title: "Password copied to clipboard!" });
    }
  };

  const handleChangePassword = async () => {
    if (!canChangePassword) {
      toast({ title: "Please fill all fields and meet all requirements.", variant: "destructive" });
      return;
    }
    setIsChanging(true);
    try {
      await dispatch(updateSellerPassword({ userId: user.id, newPassword })).unwrap();
      toast({ title: "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      toast({ title: "Failed to update password.", variant: "destructive" });
    }
    setIsChanging(false);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">⚙️ Settings</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="gap-4 bg-muted p-2 rounded-xl">
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">General Settings</h2>
            {/* Username Edit */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input
                placeholder="New Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Button onClick={handleChangeUsername}>
                Update Username
              </Button>
            </div>
            {/* Password Edit */}
            <div className="space-y-2 mt-6">
              <div className="relative w-full">
                <Input
                  type={showOld ? "text" : "password"}
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowOld(v => !v)}
                  tabIndex={-1}
                >
                  {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative w-full mt-2">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="pr-16"
                />
                {/* Copy button */}
                <button
                  type="button"
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                  onClick={handleCopyPassword}
                  tabIndex={-1}
                  aria-label="Copy password"
                >
                  <CopyIcon className="w-5 h-5" />
                </button>
                {/* Eye button */}
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowNew(v => !v)}
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-2">
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
                  <div className="grid grid-cols-2 gap-2 mt-2">
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
                </div>
              )}
              {/* Confirm New Password */}
              <div className="relative mt-2">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  {passwordsMatch && confirmNewPassword && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, rotate: -90 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
                {confirmNewPassword && !passwordsMatch && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs">No match</span>
                )}
              </div>
              <Button
                className="mt-4 w-full"
                onClick={handleChangePassword}
                disabled={!canChangePassword || isChanging}
              >
                {isChanging ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}