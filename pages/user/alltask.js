import React, { useEffect, useState } from "react";
import UserLayout from "@/components/UserLayout";
import { useRouter } from "next/router";

export default function Alltask() {
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

    const userId = user?.id;
    const token = user?.token;

    if (!token || !userId) {
      alert("Invalid session. Please log in again.");
      router.push("/login");
      return;
    }

    // Fetch all users and build user ID -> name map
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
            // Use first_name + last_name if 'name' not available
            const name = user.name || `${user.first_name} ${user.last_name}`;
            map[user.id] = name;
          });
          setUserMap(map);
        } else {
          console.error("Unexpected user list response:", result);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });

    // Fetch tasks created by current user
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

        const userTasks = result.data.filter((task) => task.created_by === userId);
        setTasks(userTasks);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
      });
  }, []);

  return (
    <UserLayout>
      <div className="container">
        <h2 className="mb-4" style={{textAlign:"center"}}>All Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="row">
            {tasks.map((task) => (
              <div key={task.id} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <p className="card-title"><strong>Task:</strong> {task.title}</p>
                    <p className="mb-1"><strong>Assigned To:</strong> {userMap[task.assigned_to] || "Unknown"}</p>
                    <p className="mb-1"><strong>Due Date:</strong> {new Date(task.due_date).toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Status:</strong> {task.status}</p>
                    <p className="mb-0"><strong>Priority:</strong> {task.priority || "N/A"}</p>
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
