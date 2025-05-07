import React, { useState, useEffect } from "react";
import UserLayout from "@/components/UserLayout";
import { useRouter } from "next/router";
import { MdHeight } from "react-icons/md";

export default function Dashboard() {
  const [assignedCount, setAssignedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const memberRaw = sessionStorage.getItem("user");

    if (!memberRaw) {
      alert("You must be logged in.");
      router.push("/login");
      return;
    }

    let member;
    try {
      member = JSON.parse(memberRaw);
    } catch (err) {
      console.error("Failed to parse user from sessionStorage:", err);
      return;
    }

    const userId = member?.id;
    const token = member?.token;

    if (!token || !userId) {
      alert("Invalid user session. Please log in again.");
      router.push("/login");
      return;
    }

    fetch("https://node-task-management-api-1.onrender.com/api/tasks/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.isSuccess || !Array.isArray(result.data)) {
          console.error("Unexpected API response:", result);
          return;
        }

        const tasks = result.data;

        // Created tasks by this user
        const createdTasks = tasks.filter((task) => task.created_by === userId);
        setCreatedCount(createdTasks.length);

        //  Unique assigned users by this user (excluding self)
        const assignedToUsers = new Set(
          createdTasks
            .map((task) => task.assigned_to)
            .filter((id) => id && id !== userId)
        );
        setAssignedCount(assignedToUsers.size);

        // Overdue tasks: due_date < today (status doesn't matter)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // today at midnight

        const overdueTasks = tasks.filter((task) => {
          const due = new Date(task.due_date);
          due.setHours(0, 0, 0, 0); // task due date at midnight

          return due < today; // only check date
        });

        console.log("Overdue tasks:", overdueTasks);
        setOverdueCount(overdueTasks.length);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      });
  }, []);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Tasks assigned</h5>
              
              <div className="d-flex justify-content-between align-items-center">
  <p className="card-text fs-4 mb-0">{assignedCount}</p>
  <button
    className="btn btn-primary"
    onClick={() => router.push("/user/assignusertask")}
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
              <h5 className="card-title">Tasks created</h5>
              
              <div className="d-flex justify-content-between align-items-center">
              <p className="card-text fs-4 mb-0">{createdCount}</p>
  <button
    className="btn btn-primary"
    onClick={() => router.push("/user/alltask")}
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
              <h5 className="card-title">Overdue tasks</h5>
              <div className="d-flex justify-content-between align-items-center">
              <p className="card-text fs-4 mb-0">{overdueCount}</p>
  <button
    className="btn btn-primary"
    onClick={() => router.push("/user/overduetasks")}
  >
    See this
  </button>
</div>
            
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
