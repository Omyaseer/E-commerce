import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/useAuth";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const authData = await login(formData.email, formData.password);
      
      if (authData && authData.token) {
        toast.success("Login successful!");
        // Navigate immediately - no delay
        navigate("/home", { replace: true });
        setLoading(false);
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Login failed");
      toast.error("Login failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 col-12">
          <img className="w-75" src="/image/loo.png" alt="login" />
        </div>

        <div className="col-md-4 col-12 mt-lg-5 pb-lg-5 mt-5 pt-5">
          <h2 className="mt-4">Log in to Pes cart</h2>
          <h6 className="pt-2 mb-5">Enter your details below</h6>

          <form className="row gap-4" onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-sm-12">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="form-control border-0 border-bottom bg-white"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-12">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control border-0 border-bottom bg-white"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <span className="d-flex justify-content-center align-items-center gap-2">
                  <span className="spinner-border spinner-border-sm text-light"></span>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>

            {error && (
              <>
                <div className="alert alert-danger text-center py-2 fs-6 mt-2">
                  {error}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Link 
                    to="/ForgetPassword" 
                    className="text-decoration-none text-danger"
                  >
                    Forget Password?
                  </Link>
                  <span className="text-muted">or</span>
                  <Link 
                    to="/CreateAccount" 
                    className="text-decoration-none text-danger"
                  >
                    Create Account
                  </Link>
                </div>
              </>
            )}

            {!error && (
              <div className="text-center mt-3">
                <Link 
                  to="/ForgetPassword" 
                  className="text-decoration-none text-muted"
                >
                  Forget Password?
                </Link>
              </div>
            )}

            <div className="text-center mt-3">
              <span className="text-muted">Don't have an account? </span>
              <Link 
                to="/CreateAccount" 
                className="text-decoration-none text-danger"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
