const RightSidebar = () => {
  return (
    <aside className="hidden xl:flex flex-col w-64 h-screen bg-white shadow-md border-l border-gray-200 fixed right-0 top-0 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Suggestions</h2>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="bg-gray-50 p-3 rounded-lg shadow-sm">
            👨‍🦱 <strong>John Doe</strong> <br />
            📧 john@example.com
          </li>
          <li className="bg-gray-50 p-3 rounded-lg shadow-sm">
            👩‍🦰 <strong>Jane Smith</strong> <br />
            📧 jane@example.com
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;