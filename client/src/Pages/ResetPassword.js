import React, { useState } from 'react';

import { useSearchParams,useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword,setConfirmNewPassword] = useState('')
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setMessage("Passwords do not match.");
            return;
          }
        try {
            const response =  await fetch('/reset-password', {
            method:"POST",
            headers: { "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
             },
            body: JSON.stringify({ new_password: newPassword })
                });
            if(response.ok){
                const errorData = await response.json();
                setMessage(`${errorData.msg}. Navigate to login`) ;
            }
            else{
                const errorData = await response.json();
                setMessage(errorData.msg);
                console.log(errorData)
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default ResetPassword;