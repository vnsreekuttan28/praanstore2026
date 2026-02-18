// 'use client'
// import { User, Plus, X, Shield, Phone, Key, Search, Loader2 } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { addUser, fetchUsers, UserModel } from '../Models/UserModel'

// const Users = () => {
//     const [_currentUsers, SetCurrentUser] = useState<UserModel[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [openNewUserForm, SetOpenUserForm] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');

//     // State object to handle all inputs at once
//     const [formData, setFormData] = useState({
//         id: '',
//         name: '',
//         contact: '',
//         role: 'Distributor', // Default role
//         pw: ''
//     });

//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         setIsLoading(true);
//         try {
//             const users = await fetchUsers();
//             SetCurrentUser(users);
//         } catch (error) {
//             console.error("Failed to fetch:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const closeForm = () => {
//         setFormData({ id: '', name: '', contact: '', role: 'Distributor', pw: '' });
//         SetOpenUserForm(false);
//     };

//     const submitNewUser = async () => {
//         if (!formData.id || !formData.name || !formData.pw) return alert("Fill required fields");
        
//         setIsLoading(true);
//         try {
//             await addUser(formData);
//             await loadData();
//             closeForm();
//         } catch (error) {
//             alert(error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const editUserForm = (user: UserModel) => {
//         setFormData({
//             id: user.id,
//             name: user.name,
//             contact: user.contact,
//             role: user.role,
//             pw: user.pw
//         });
//         SetOpenUserForm(true);
//     };

//     // Filtered users for search functionality
//     const filteredUsers = _currentUsers.filter(u => 
//         u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         u.role.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className='h-full flex flex-col p-6 bg-white border border-gray-200 rounded-2xl shadow-sm max-h-[75vh]'>
//             {/* Header & Search */}
//             <div className='flex justify-between items-center mb-6'>
//                 <div className='flex gap-4 items-center'>
//                     <div className='bg-blue-100 text-blue-700 rounded-xl p-3'>
//                         <User size={24} />
//                     </div>
//                     <h1 className='text-xl font-bold text-gray-800'>Team Members</h1>
//                 </div>
//                 <button 
//                     onClick={() => SetOpenUserForm(true)}
//                     className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2'
//                 >
//                     <Plus size={18} /> Add User
//                 </button>
//             </div>

//             <div className='relative mb-6'>
//                 <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
//                 <input 
//                     type="text" 
//                     placeholder="Search by name or role..." 
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className='w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all'
//                 />
//             </div>

//             {/* Users List Grid */}
//             <div className='flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar'>
//                 {isLoading && _currentUsers.length === 0 ? (
//                     <div className='flex justify-center p-10'><Loader2 className='animate-spin text-blue-600' /></div>
//                 ) : (
//                     filteredUsers.map((user, index) => (
//                         <div 
//                             key={index} 
//                             onClick={() => editUserForm(user)}
//                             className='group p-4 bg-gray-50 border border-transparent rounded-2xl flex items-center justify-between hover:bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer'
//                         >
//                             <div className='flex items-center gap-4'>
//                                 <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold'>
//                                     {user.name.charAt(0)}
//                                 </div>
//                                 <div>
//                                     <h2 className='font-bold text-gray-800'>{user.name}</h2>
//                                     <p className='text-[10px] text-gray-400 font-mono'>ID: {user.id}</p>
//                                 </div>
//                             </div>
//                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
//                                 {user.role}
//                             </span>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {/* Modern Modal Overlay */}
//             {openNewUserForm && (
//                 <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
//                     <div className='relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200'>
//                         <div className='flex justify-between items-center mb-8'>
//                             <h2 className='text-2xl font-black text-gray-800'>User Profile</h2>
//                             <button onClick={closeForm} className='p-2 hover:bg-gray-100 rounded-full text-gray-400'><X /></button>
//                         </div>

//                         <div className='space-y-5'>
//                             <div className='grid grid-cols-2 gap-4'>
//                                 <div className='space-y-1'>
//                                     <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Employee ID</label>
//                                     <input name="id" value={formData.id} onChange={handleInputChange} className='w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-blue-500' placeholder='UID-001' />
//                                 </div>
//                                 <div className='space-y-1'>
//                                     <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Role</label>
//                                     <select name="role" value={formData.role} onChange={handleInputChange} className='w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-blue-500'>
//                                         <option value="Admin">Admin</option>
//                                         <option value="Distributor">Distributor</option>
//                                         <option value="Store Manager">Store Manager</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             <div className='space-y-1'>
//                                 <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Full Name</label>
//                                 <input name="name" value={formData.name} onChange={handleInputChange} className='w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-blue-500' placeholder='John Doe' />
//                             </div>

//                             <div className='space-y-1'>
//                                 <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Contact Number</label>
//                                 <div className='relative'>
//                                     <Phone className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-300' size={16} />
//                                     <input name="contact" value={formData.contact} onChange={handleInputChange} className='w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl' placeholder='+91 00000 00000' />
//                                 </div>
//                             </div>

//                             <div className='space-y-1'>
//                                 <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>System Password</label>
//                                 <div className='relative'>
//                                     <Key className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-300' size={16} />
//                                     <input name="pw" type="password" value={formData.pw} onChange={handleInputChange} className='w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl' placeholder='••••••••' />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className='flex gap-4 mt-10'>
//                             <button onClick={closeForm} className='flex-1 py-4 text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all'>Discard</button>
//                             <button onClick={submitNewUser} className='flex-1 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-100 transition-all'>
//                                 {isLoading ? 'Saving...' : 'Save Member'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Users;