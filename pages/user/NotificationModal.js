// components/NotificationModal.jsx
import React, { useState } from 'react';

export default function NotificationModal({ show, onClose, task, receiverId }) {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const member = JSON.parse(sessionStorage.getItem('user'));
    if (!member || !member.token) {
      alert('User not authenticated');
      return;
    }

    const headers = {
      Authorization: `Bearer ${member.token}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      user_id: receiverId,
      message,
      is_read: false,
      related_task_id: task?._id || null,
      related_project_id: task?.project_id || null,
    };

    try {
      const res = await fetch('https://node-task-management-api-1.onrender.com/api/notifications', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        sessionStorage.setItem('notification', JSON.stringify(result?.data || {}));
        alert('Notification sent successfully!');
        setMessage('');
        onClose();
      } else {
        alert('Failed to send notification');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending notification');
    }
  };

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Send Notification</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-success" onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
