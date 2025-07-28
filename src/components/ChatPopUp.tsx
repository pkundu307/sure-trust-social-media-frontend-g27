
import { useEffect, useState } from "react"
import ChatWindow from "./ChatWindow"


const ChatPopUp = () => {
    const[isOpen, setIsOpen] = useState(false);

useEffect(() => {
    // console.log('====================================');
    // console.log(isOpen);
    // console.log('====================================');
},[isOpen])
  return (

< div>
{localStorage.getItem('token') && <div className="fixed bottom-4 right-4 z-50">
    {!isOpen &&<>
    <div className="flex items-center bg-green-500 px-3 py-2 rounded-full shadow-lg cursor-pointer hover:scale-105 transition"
    onClick={() => setIsOpen(true)}>
    <div className="relative w-8 h-8 bg-grey-300 overflow-hidden mr-2">
        <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="Chat Icon" className="w-full h-full object-cover"/>


    </div>
    <span className="font-medium text-sm">
        Messages
    </span>
    {/* <ChatWindow onClose={() => setIsOpen(false)}/> */}
    </div>
    </>}
         {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

 </div>}

</div>
  )
}

export default ChatPopUp
