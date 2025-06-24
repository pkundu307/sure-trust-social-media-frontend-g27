const LeftSidebar = () => {
  return (
    <div className='w-full lg:w-1/4 bg-white p-4 shadow-lg rounded-lg '>
     <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Left Sidebar</h2>
        <ul className="space-y-2">
            <li><a href="/home" className="text-blue-600 hover:underline">Home</a></li>
            <li><a href="/profile" className="text-blue-600 hover:underline">Profile</a></li>
            <li><a href="/settings" className="text-blue-600 hover:underline">Settings</a></li>
            <li><a href="/about" className="text-blue-600 hover:underline">About</a></li>
        </ul>
     </div>
    </div>
  )
}

export default LeftSidebar
