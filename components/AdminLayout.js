
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MdDashboard, MdWork, MdAssignment, MdAccountCircle  } from 'react-icons/md';

export default function AdminLayout({ children }) {
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
        {/* sidebar */}
        <nav className={`col-md-2 ${sidebarVisible ? 'd-block' : 'd-none'} d-md-block bg-dark sidebar text-white p-3`}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/Dashboard">
                <MdDashboard className="me-2" /> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/project">
                <MdWork className="me-2" /> Project
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/createtask">
                <MdAssignment className="me-2" /> Task
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/users">
                <MdAccountCircle  className="me-2" /> Users
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
            <h3 className="me-3 d-none d-sm-block">Welcome! {user.name}(Admin)</h3>
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
