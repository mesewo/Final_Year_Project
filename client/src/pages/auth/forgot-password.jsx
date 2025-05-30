function ForgotPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md py-12">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
export default ForgotPasswordPage;