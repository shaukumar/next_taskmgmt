import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MdDashboard, MdNotifications, MdAssignment, MdOutlineSupervisorAccount } from 'react-icons/md';

export default function UserLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser.token) {
      router.push('/login');
    } else {
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (!user) return null;

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Sidebar */}
        <nav className={`col-md-2 ${sidebarVisible ? 'd-block' : 'd-none'} d-md-block bg-dark sidebar text-white p-3`}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link text-white" href="/user/Dashboard">
                <MdDashboard className="me-2" /> Dashboard
              </a>
            </li>
            
            <li className="nav-item">
              <a className="nav-link text-white" href="/user/createtask">
                <MdAssignment className="me-2" /> Task
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/user/assignusertask">
                <MdOutlineSupervisorAccount className="me-2" /> Tasks Assigned
              </a>
            </li>
             <li className="nav-item">
                          <a className="nav-link text-white" href="#">
                            <MdNotifications className="me-2" /> Notifications
                          </a>
                        </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="col-md-10 ml-sm-auto col-lg-10 px-4">
          {/* Topbar */}
          <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
            <button className="btn btn-primary d-md-none" onClick={toggleSidebar}>
              ☰
            </button>
            <h3 className="me-3 d-none d-sm-block">Welcome! {user.name}</h3>
            <div>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          {/* Page Content */}
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
