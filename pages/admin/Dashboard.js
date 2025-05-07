import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [projectCount, setProjectCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCounts = async () => {
      const stored = sessionStorage.getItem("user");
      if (!stored) return;
      const parsed = JSON.parse(stored);

      const headers = {
        Authorization: `Bearer ${parsed.token}`,
      };

      try {
        const [projectRes, userRes, taskRes] = await Promise.all([
          fetch("https://node-task-management-api-1.onrender.com/api/projects/", { headers }),
          fetch("https://node-task-management-api-1.onrender.com/api/users/List", { headers }),
          fetch("https://node-task-management-api-1.onrender.com/api/tasks/", { headers }),
        ]);

        const projectData = await projectRes.json();
        const userData = await userRes.json();
        const taskData = await taskRes.json();

        if (projectRes.ok && projectData?.isSuccess) {
          setProjectCount(projectData.data.length || 0);
        }

        if (userRes.ok && userData?.isSuccess) {
          setUserCount(userData.data.length || 0);
        }

        if (taskRes.ok && taskData?.isSuccess) {
          setTaskCount(taskData.data.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Projects</h5>
              <div className="d-flex justify-content-between align-items-center">
              <p className="card-text fs-4 mb-0">{projectCount}</p>
  <button
    className="btn btn-primary"
    onClick={() => router.push("/admin/project")}
  >
    See this
  </button>
</div>
              
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <div className="d-flex justify-content-between align-items-center">
              <p className="card-text fs-4 mb-0">{userCount}</p>
  <button
    className="btn btn-primary"
    onClick={() => router.push("/admin/users")}
  >
    See this
  </button>
</div>
              
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <div className="d-flex justify-content-between align-items-center">
              <p className="card-text fs-4 mb-0">{taskCount}</p>
  <button
    className="btn btn-primary"
    onClick={() => router.push("/admin/createtask")}
  >
    See this
  </button>
</div>

            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
