import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import api from "../../api/Api";
import "./User.css";
import { toast } from "react-toastify";
import { User as UserIcon, Mail, Shield, Edit, Save, X, LogOut } from "lucide-react";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${user.id}`);
      if (response.data && response.data.data) {
        const userInfo = response.data.data;
        setUserData(userInfo);
        setFormData({
          name: userInfo.name || "",
          email: userInfo.email || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.patch(`/users/${user.id}`, formData);
      if (response.data && response.data.data) {
        setUserData(response.data.data);
        setEditing(false);
        toast.success("Profile updated successfully");
        // Update local storage if needed
        const updatedUser = {
          ...user,
          name: response.data.data.name,
          email: response.data.data.email,
        };
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "super_admin":
        return "danger";
      case "admin":
        return "warning";
      default:
        return "primary";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/Login");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <Container className="user-container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading user data...</p>
        </div>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="user-container py-5">
        <div className="text-center py-5">
          <p className="text-danger">Failed to load user data</p>
          <Button variant="danger" onClick={fetchUserData}>
            Retry
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="user-container py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="user-card shadow-lg">
            <Card.Body className="p-4">
              {/* Header Section */}
              <div className="user-header text-center mb-4">
                <div className="user-avatar mb-3">
                  <UserIcon size={80} className="text-danger" />
                </div>
                <h2 className="mb-2">{userData.name || "User"}</h2>
                <span
                  className={`badge bg-${getRoleBadgeColor(
                    userData.role
                  )} px-3 py-2`}
                >
                  {userData.role?.toUpperCase() || "USER"}
                </span>
              </div>

              <hr className="my-4" />

              {/* User Information */}
              <div className="user-info">
                <h4 className="mb-4">Profile Information</h4>

                <div className="info-item mb-4">
                  <label className="info-label">
                    <Mail size={20} className="me-2" />
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control mt-2"
                      placeholder="Enter email"
                    />
                  ) : (
                    <p className="info-value mt-2">{userData.email}</p>
                  )}
                </div>

                <div className="info-item mb-4">
                  <label className="info-label">
                    <UserIcon size={20} className="me-2" />
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control mt-2"
                      placeholder="Enter name"
                    />
                  ) : (
                    <p className="info-value mt-2">{userData.name}</p>
                  )}
                </div>

                <div className="info-item mb-4">
                  <label className="info-label">
                    <Shield size={20} className="me-2" />
                    Account Status
                  </label>
                  <p className="info-value mt-2">
                    <span
                      className={`badge p-2 ${
                        userData.isActive ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {userData.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="user-actions mt-4 pt-4 border-top">
                {editing ? (
                  <div className="d-flex gap-2 justify-content-end">
                    <Button variant="secondary" onClick={handleCancel}>
                      <X size={18} className="me-2" />
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={handleSave}>
                      <Save size={18} className="me-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex gap-2 justify-content-between flex-wrap">
                    <Button variant="outline-danger py-2 px-2" onClick={handleLogout}>
                      <LogOut size={18} className="me-2 " />
                      Logout
                    </Button>
                    <Button variant="danger" onClick={handleEdit}>
                      <Edit size={18} className="me-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default User;

