import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import {MdAddTask, MdEdit, MdDelete} from "react-icons/md";

export default function Project() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [editingProject, setEditingProject] = useState(null);
  const [message, setMessage] = useState("");

  // Load Bootstrap JS
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((module) => {
      window.bootstrap = module;
    });
  }, []);

  // Check login
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    if (!parsed?.token) {
      router.push("/login");
    } else {
      setAdmin(parsed);
    }
  }, []);

  // Fetch projects
  useEffect(() => {
    if (admin) {
      fetchProjects();
    }
  }, [admin]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("https://node-task-management-api-1.onrender.com/api/projects/", {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const result = await res.json();
      if (res.ok && result.isSuccess) {
        setProjects(result.data);
        sessionStorage.setItem("projectCount", result.data.length.toString());
      } else {
        setMessage("❌ Failed to load projects.");
      }
    } catch {
      setMessage("❌ Error fetching projects.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      created_by: admin.id,
    };

    try {
      const res = await fetch("https://node-task-management-api-1.onrender.com/api/projects/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.isSuccess) {
        setMessage("✅ Project created successfully.");
        setFormData({ name: "", description: "", start_date: "", end_date: "" });
        document.getElementById("closeModal").click();
        fetchProjects(); // Refresh list
      } else {
        setMessage("❌ " + (result.message || "Failed."));
      }
    } catch (err) {
      setMessage("❌ Network error.");
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      start_date: project.start_date.split("T")[0],
      end_date: project.end_date.split("T")[0],
    });
    new bootstrap.Modal(document.getElementById("editProjectModal")).show();
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    const payload = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      created_by: admin.id,
    };

    try {
      const res = await fetch(`https://node-task-management-api-1.onrender.com/api/projects/${editingProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.isSuccess) {
        setMessage("✅ Project updated successfully.");
        setEditingProject(null);
        fetchProjects();
        setTimeout(() => {
          document.getElementById("closeEditModal").click();
        }, 100);
        // document.getElementById("closeEditModal").click();
      } else {
        setMessage("❌ " + (result.message || "Update failed."));
      }
    } catch {
      setMessage("❌ Network error during update.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`https://node-task-management-api-1.onrender.com/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.isSuccess) {
        setMessage("✅ Project deleted successfully.");
        fetchProjects();
      } else {
        setMessage("❌ " + (result.message || "Failed to delete."));
      }
    } catch {
      setMessage("❌ Network error during deletion.");
    }
  };

  if (!admin) return null;

  return (
    <AdminLayout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3>All Projects</h3>
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#projectModal"
          onClick={() => {
            setFormData({
              name: "",
              description: "",
              start_date: "",
              end_date: "",
            });
            setEditingProject(null); 
          }}
          >
            <MdAddTask size={18} /> Create New Project
          </button>
        </div>

        {message && (
          <div className="alert alert-info alert-dismissible fade show mt-3" role="alert">
            {message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}

        {/* Cards for Projects */}
        <div className="row mt-4">
          {projects.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-warning text-center">No projects found.</div>
            </div>
          ) : (
            projects.map((proj) => (
              <div className="col-md-4" key={proj._id}>
                <div className="card mb-3">
                  <div className="card-body">
                    <p className="card-title"><strong>Project:</strong> {proj.name}</p>
                    <p className="card-text"><strong>Project desc.:</strong> {proj.description}</p>
                    <p className="card-text">
                      <strong>Start Date:</strong> {new Date(proj.start_date).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <strong>End Date:</strong> {new Date(proj.end_date).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <strong>Created By:</strong> {proj.created_by?.name || "N/A"}
                    </p>
                    <div className="d-flex justify-content-end gap-3">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(proj)}>
                      <MdEdit size={18} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(proj._id)}>
                      <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Modal */}
        <div className="modal fade" id="projectModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Project</h5>
                <button type="button" className="btn-close" id="closeModal" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Project Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-success">Create</button>
              </div>
            </form>
          </div>
        </div>

        {/* Edit Modal */}
        <div className="modal fade" id="editProjectModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content" onSubmit={handleUpdateSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button type="button" className="btn-close" id="closeEditModal" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Project Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
