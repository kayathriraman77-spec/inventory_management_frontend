import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h2>Admin Profile</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          

          <button className="btn-primary">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}