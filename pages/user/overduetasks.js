import React, { useEffect, useState } from "react";
import UserLayout from "@/components/UserLayout";
import { useRouter } from "next/router";

export default function OverdueTasks() {
  const [tasks, setTasks] = useState([]);
  const [userMap, setUserMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    const userRaw = sessionStorage.getItem("user");
    if (!userRaw) {
      alert("You must be logged in.");
      router.push("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(userRaw);
    } catch (err) {
      console.error("Invalid user data:", err);
      return;
    }

    const token = user?.token;

    if (!token) {
      alert("Invalid session. Please log in again.");
      router.push("/login");
      return;
    }

    // Fetch user list and build user ID -> name map
    fetch("https://node-task-management-api-1.onrender.com/api/users/List", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result.data)) {
          const map = {};
          result.data.forEach((user) => {
            map[user.id] = user.name;
          });
          setUserMap(map);
        } else {
          console.error("Invalid user list response:", result);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });

    // Fetch tasks
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const overdue = result.data.filter((task) => {
          const due = new Date(task.due_date);
          due.setHours(0, 0, 0, 0);
          return due < today;
        });

        setTasks(overdue);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
      });
  }, []);

  return (
    <UserLayout>
      <div className="container">
        <h2 className="mb-4">Overdue Tasks</h2>
        {tasks.length === 0 ? (
          <p>No overdue tasks.</p>
        ) : (
          <div className="row">
            {tasks.map((task) => (
              <div key={task.id} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <p className="card-title"><strong>Task:</strong> {task.title}</p>
                    <p><strong>Assigned To:</strong> {userMap[task.assigned_to] || "Unknown"}</p>
                    <p><strong>Due Date:</strong> {new Date(task.due_date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {task.status}</p>
                    <p><strong>Priority:</strong> {task.priority || "N/A"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
