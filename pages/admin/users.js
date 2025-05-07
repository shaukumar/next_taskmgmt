import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";

export default function Users() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const admin = JSON.parse(sessionStorage.getItem("user"));
    if (!admin || !admin.token) {
      router.push("/login");
      return;
    }

    setToken(admin.token);
    fetchUsers(admin.token);
  }, []);

  const fetchUsers = async (token) => {
    try {
      const res = await fetch("https://node-task-management-api-1.onrender.com/api/users/List", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.isSuccess) setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://node-task-management-api-1.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (result.isSuccess) {
        alert("User added successfully");
        setForm({ name: "", email: "", password: "", role: "admin" });
        fetchUsers(token);
      } else {
        alert(result.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Add user error:", error);
    }
  };

  return (
    <AdminLayout>
    <div className="container mt-5">
      <h2>Add New User</h2>
      <form className="row g-3 mb-5" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add User
          </button>
        </div>
      </form>

      <h3>User List</h3>
      <div className="row">
        {users.map((user) => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.email}</p>
                <span className="badge bg-secondary text-capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}
