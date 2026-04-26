import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/Api";
import { toast } from "react-toastify";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Note: You'll need to create this endpoint in the backend
      await api.post("/auth/forget-password", { email });
      setMessage("Password reset instructions have been sent to your email!");
      toast.success("Check your email for password reset instructions");
      
      setTimeout(() => {
        navigate("/Login");
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Email not found. Please check your email or create a new account.";
      setMessage(msg);
      toast.error(msg);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Forget Password</h2>
              <p className="text-center text-muted mb-4">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-danger w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex justify-content-center align-items-center gap-2">
                      <span className="spinner-border spinner-border-sm text-light"></span>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                {message && (
                  <div className={`alert mt-3 text-center ${message.includes("sent") ? "alert-success" : "alert-danger"}`}>
                    {message}
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link to="/Login" className="text-decoration-none text-danger">
                    Back to Login
                  </Link>
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/CreateAccount" className="text-decoration-none text-danger">
                    Create Account
                  </Link>
                </div>
              </form>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;

