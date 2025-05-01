import { useState, useEffect } from "react";
import api from '../../api/auth/axiosInstance';
import { cookies } from '../../utils/cookie';
import Sidebar from "../../components/sideBar/sideBar";

export default function TeamMembersPage() {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };
    return (
        <div>
            <Sidebar status={isOpen} toggleSidebar={toggleSidebar}/>
            <h1 style={{textAlign : 'center'}}>Team Members Page</h1>
        </div>
    );
}