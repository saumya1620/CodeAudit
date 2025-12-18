// import React from 'react'
// import { BrainCircuit, Sun } from 'lucide-react';

// // This function returns a Navbar component
// const Navbar = () => {
//   // Return a JSX element
//   return (
//     <>
//       <div className="nav flex items-center justify-between h-[90px] bg-zinc-900" style={{padding:"0px 150px"}}>
//         <div className="logo flex items-center gap-[10px]">
//           <BrainCircuit size={30} color='#9333ea'/>
//           <span className="text-2xl font-bold text-white ml-2">CodeAudit</span>
//         </div>
//         {/* <div className="icons flex items-center gap-[20px]">
//           <i className='cursor-pointer transition-all hover:text-[#9333ea]'><Sun/></i>
//         </div> */}
//       </div>
//     </>
//   )
// }

// export default Navbar




import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./Authmodal";

const Navbar = ({ onHistory }) => {
  const { token, logout } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <div className="h-[90px] bg-zinc-900 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold">CodeAudit</h1>

        <div className="flex gap-3">
          {token && (
            <button onClick={onHistory} className="btnNormal">
              History
            </button>
          )}

          {!token ? (
            <button onClick={() => setShowAuth(true)} className="btnNormal">
              Login
            </button>
          ) : (
            <button onClick={logout} className="btnNormal">
              Logout
            </button>
          )}
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;
