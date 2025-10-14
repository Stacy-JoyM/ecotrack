import Sidebar from "./Sidebar";

// MainLayout Component
const MainLayout = ({ children, activePage, onNavigate }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
export default MainLayout; 