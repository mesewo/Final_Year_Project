import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { changePassword, deleteAccount } from "@/store/shop/user-slice";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Dialog, DialogContent } from "../ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/auth-slice"; // <-- import your logout action
import { EyeIcon, EyeOffIcon, InfoIcon, CopyIcon, ShieldCheckIcon } from "lucide-react";

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

export default function SecuritySection() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- add this
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleChangePassword = async () => {
    if (!canChangePassword) {
      toast({ title: "Please fill all fields and meet all requirements.", variant: "destructive" });
      return;
    }
    setIsChanging(true);
    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
      toast({ title: "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      toast({ title: "Failed to update password.", variant: "destructive" });
    }
    setIsChanging(false);
  };

  const handleDeleteAccount = async () => {
    setShowDeleteDialog(false);
    try {
      await dispatch(deleteAccount()).unwrap();
      toast({
        title: "Account deleted.",
        description: "Your account and all data have been deleted.",
        variant: "destructive",
      });
      await dispatch(logoutUser()); // <-- log out the user
      navigate("/farewell", { replace: true }); // <-- update this line
    } catch (err) {
      toast({ title: "Failed to delete account.", variant: "destructive" });
    }
  };

  // Copy password to clipboard
  const handleCopyPassword = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      toast({ title: "Password copied to clipboard!" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      {/* Password Tips */}
      <div className="mb-4 flex items-center gap-2 text-blue-700 text-sm">
        <InfoIcon className="w-4 h-4" />
        <span>
          Use a strong password. Don’t reuse passwords from other sites.
        </span>
      </div>
      {/* Old Password */}
      <div className="relative mb-2">
        <input
          type={showOld ? "text" : "password"}
          placeholder="Old Password"
          className="border rounded px-2 py-1 w-full pr-10"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          onClick={() => setShowOld(v => !v)}
          tabIndex={-1}
        >
          {showOld ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
      </div>
      {/* New Password */}
      <div className="relative mb-2">
        <input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          className="border rounded px-2 py-1 w-full pr-20"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        {/* Copy button */}
        <button
          type="button"
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
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
          aria-label="Show/Hide password"
        >
          {showNew ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
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
      <div className="relative mb-4">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm New Password"
          className="border rounded px-2 py-1 w-full pr-10"
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          onClick={() => setShowConfirm(v => !v)}
          tabIndex={-1}
        >
          {showConfirm ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
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
      {/* Session timeout info */}
      <div className="mb-4 text-xs text-gray-500 flex items-center gap-2">
        <ShieldCheckIcon className="w-4 h-4" />
        <span>
          For your security, you may be logged out automatically after a period of inactivity.
        </span>
      </div>
      {/* Security tips */}
      <div className="mb-4">
        <div className="font-semibold text-sm mb-1">Security Tips:</div>
        <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
          <li>Never share your password with anyone.</li>
          <li>Always log out after using a public computer.</li>
          <li>Use a unique password for this site.</li>
        </ul>
      </div>
      {/* Two-Factor Authentication info */}
      <div className="mb-4 p-3 bg-blue-50 rounded text-blue-700 flex items-center gap-2">
        <ShieldCheckIcon className="w-5 h-5" />
        <span>
          <b>Coming soon:</b> Add extra protection with Two-Factor Authentication (2FA).
        </span>
      </div>
      <Button
        className="mb-4 w-full"
        onClick={handleChangePassword}
        disabled={!canChangePassword || isChanging}
      >
        {isChanging ? "Updating..." : "Change Password"}
      </Button>
      <hr className="my-4" />
      <h2 className="text-xl font-bold mb-4">Account Action</h2>
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => setShowDeleteDialog(true)}
      >
        Delete Account
      </Button>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <h3 className="text-lg font-bold mb-2 text-red-600">Are you sure?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Deleting your account is <span className="font-bold text-red-600">permanent</span>.<br />
            <span className="text-red-600">All your data, including pending orders, will be lost.</span>
            <br />This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Yes, Delete My Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}