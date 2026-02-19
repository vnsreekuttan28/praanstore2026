'use client'
import { Contact, Search, Trash, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { addUser, deleteUser, fetchUsers, UserModel } from '../Models/UserModel'
import { fetchOrders, OrderModel } from '../Models/OrderModel'

const Users_section = () => {
    const [_currentUsers, SetCurrentUsers] = useState<UserModel[]>([]);
    const [_allUsers, SetAllUsers] = useState<UserModel[]>([]);
    const [_currentOrders, SetCurrentOrders] = useState<OrderModel[]>([]);
    const [_filteredUsers, SetFilteredUsers] = useState<UserModel[]>([]);
    const [openUserform, SetOpenUserform] = useState(false);
    const [searchquery, setSearchQuery] = useState('');
    const [Refresh, SetRefresh] = useState(false);
    const [newUserID, SetNewuserID] = useState('');
    const [newUsername, SetNewusername] = useState('');
    const [newUsercontact, SetNewusercontact] = useState('');
    const [newUserpw, SetNewuserpw] = useState('');
    const [newUserrole, SetNewuserrole] = useState('Field Staff');
    const roles = ["Field Staff", "Manager", "Admin"];
     const [openDeleteDialog, SetopenDeleteDialog] = useState(false);
     const [selectedUser, SetselectedUser]=useState<UserModel>();
     const [isfetched, Setisfetched]=useState(false);

    useEffect(() => {
        getUsers();
        getOrders();
        Setisfetched(true);


    }, [Refresh])

    useEffect(() => {
        filterUsers();

    }, [searchquery, _currentUsers])

    //get users list
    const getUsers = async () => {
        const users = await fetchUsers();
        const active_users=users.filter((user)=>{
            return(user.status===("active"))
        })
        SetCurrentUsers(active_users)
        SetAllUsers(users);
        SetNewuserID((users.length + 1).toString())
    }

    //get orderlist
    const getOrders = async () => {
        const orders = await fetchOrders();
        SetCurrentOrders(orders);

    }

    //filter users list
    const filterUsers = () => {
        const q = searchquery.toLowerCase()
        const u = _currentUsers.filter((user) => {
            return (
                user.name.toLowerCase().includes(q) ||
                user.id.toLowerCase().includes(q) ||
                user.contact.toLowerCase().includes(q) ||
                user.role.toLowerCase().includes(q)
            )
        })
        SetFilteredUsers(u)
    }

    //edit user
    const Edituser = (user: UserModel) => {
        SetNewuserID(user.id);
        SetNewusername(user.name);
        SetNewuserpw(user.pw);
        SetNewuserrole(user.role);
        SetNewusercontact(user.contact);
        SetOpenUserform(true)

    }

    //prepeare delete
    const prepareDelete = (user: UserModel) => {
        SetopenDeleteDialog(true)
        SetselectedUser(user)


    }

    //delete user
    const DeleteUser=async()=>{

        deactivateUser();
       
        // if(selectedUser){
        //    await deleteUser(selectedUser). then(()=>{
        //     SetRefresh(!Refresh);
        //     SetopenDeleteDialog(false)
        //    })  
        // }   
    }

    //deactivate user
    const deactivateUser=async()=>{
        if(!selectedUser){
            return;
        }

         const u = {
            id: selectedUser.id,
            name: selectedUser.name,
            contact: selectedUser.contact,
            pw: selectedUser.pw,
            role: selectedUser.role,
            status:"deactivated"
        }

        await addUser(u).then(() => {
            SetRefresh(!Refresh);
            closeForm();
        })

    }

    //close form
    const closeForm = () => {
        SetNewuserID((_allUsers.length + 1).toString())
        SetNewusername("");
        SetNewuserpw("");
        SetNewuserrole("");
        SetNewusercontact("");
        SetOpenUserform(false)
        SetopenDeleteDialog(false)

    }

    const SubmitUser = async () => {
        if (newUsername.length < 2 || newUserpw.length < 3) {
            alert('Username and password (min 4 char) required');
            return;
        }
        const u = {
            id: newUserID,
            name: newUsername,
            contact: newUsercontact,
            pw: newUserpw,
            role: newUserrole,
            status:"active"
        }

        await addUser(u).then(() => {
            SetRefresh(!Refresh);
            closeForm();
        })

    }

    return (
        <div className='w-full flex flex-col border-2 border-gray-500 rounded-xl p-4 '>

            {/* Header */}
            <div className='w-full flex items-center gap-5 '>
                <div className='bg-green-100 text-green-700 rounded-xl p-3'>
                    <User size={24} />
                </div>

                <div className='flex flex-col gap-2'>
                    <h1 className='font-bold text-xl'>Users</h1>
                    <p className='text-sm text-gray-500'>{_currentUsers.length} active users found</p>
                </div>



                <div className='flex flex-1 flex-row-reverse'>
                    <div onClick={() => { closeForm(); SetOpenUserform(true) }} className={`px-4 py-2 bg-green-600 rounded-xl text-white cursor-pointer hover:bg-green-700 hover:shadow ${isfetched?"flex":"hidden"}  `}>+Add New</div>
                </div>

            </div>

            <div className='w-full p-2 flex gap-2 items-center bg-gray-200 rounded-xl mt-5'>
                <Search size={20} />
                <input onChange={(e) => { setSearchQuery(e.target.value) }} placeholder='Search users with name or contact or id' className='w-full  p-2 border-0 focus:outline-none text-sm ring-0 ' />

            </div>



            {/* list */}
            <div className='w-full flex flex-col gap-5 mt-10 overflow-y-scroll h-[400px]  [&::-webkit-scrollbar]:hidden '>
                {_filteredUsers.map((user, index) => {

                    const userOrders = _currentOrders.filter((o) => {
                        return o.assigned_to.id === user.id
                    })

                    const completedOrder = userOrders.filter((o) => {
                        return o.order_status === 'Delivered'
                    })

                    const pendingOrder = userOrders.filter((o) => {
                        return o.order_status === 'Assigned'
                    })
                    //  console.log(userOrders)



                    return <div onClick={() => { Edituser(user) }} key={index} className=' border-2 border-gray-300 w-full px-4 py-2 bg-green-50 rounded-xl cursor-pointer hover:shadow-sm hover:border-green-200'>
                        <div className='w-full flex justify-between items-center'>


                            <h1 className='text-lg font-semibold'>{user.name}</h1>

                            <div className='w-full pl-5'>
                                <h1 className='text-[8px] text-white font-light w-[50px] rounded-sm align-middle items-center justify-around flex  bg-green-800 '>{user.role}</h1>
                            </div>

                            <h1 className='text-sm text-gray-500 '>ID:#{user.id}</h1>
                        </div>




                        <div className='w-full flex justify-between'>
                            <p className='text-sm font-light'>{user.contact}</p>
                            <div onClick={(e) => { e.stopPropagation(); prepareDelete(user); }} className='hover:bg-red-200 rounded-xl p-2 '>
                                <Trash size={20} color='red' className='  rounded-xl' />
                            </div>


                        </div>

                        <div className='w-full text-sm flex justify-between'>
                            <p>Completd Orders:{completedOrder.length}</p>
                            <p>Pending Orders:{pendingOrder.length}</p>

                        </div>





                    </div>
                })}

            </div>

            {/* delete dialog */}
            {openUserform &&
                <div className='fixed inset-0 z-10 p-4  flex items-center justify-center '>
                    {/* overlay */}
                    <div onClick={() => { SetOpenUserform(false) }} className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'></div>

                    {/* content */}
                    <div className='relative  bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 p-4 '>
                        <h2 className='text-xl font-bold text-gray-800'>User Profile</h2>

                        <div className='w-full flex flex-col gap-5 '>

                            <div className='mt-5 flex flex-col'>
                                <h1 className='text-xs font-sans '>USER ID (Auto asssiged)</h1>
                                <input readOnly={true} value={newUserID} type="text" className='w-full p-2 bg-gray-200 rounded-xl' />
                            </div>

                            <div className=' flex flex-col'>
                                <h1 className='text-xs font-sans '>ROLE</h1>
                                <select value={newUserrole} onChange={(e) => { SetNewuserrole(e.target.value) }} className='w-full p-2 rounded-xl bg-gray-100'>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='text-xs font-sans'>USER NAME</h1>
                                <input onChange={(e) => { SetNewusername(e.target.value) }} value={newUsername} placeholder='Enter user name' type="text" className='w-full p-2 bg-gray-200 rounded-xl' />
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='text-xs font-sans'>USER CONTACT</h1>
                                <input value={newUsercontact} onChange={(e) => { SetNewusercontact(e.target.value) }} placeholder='Enter user phone number' type="number" className='w-full p-2 bg-gray-200 rounded-xl' />
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='text-xs font-sans'>USER PASSWORD</h1>
                                <input value={newUserpw} onChange={(e) => { SetNewuserpw(e.target.value) }} placeholder='Enter user password' type="password" className='w-full p-2 bg-gray-200 rounded-xl' />
                            </div>

                            <div className='w-full mt-5 flex justify-center gap-10 cursor-pointer items-center'>
                                <p onClick={() => { SetOpenUserform(false) }} className='text-sm text-gray-800'>Cancel</p>
                                <div onClick={() => { SubmitUser() }} className='px-2 py-2 rounded-xl bg-green-600 text-white font-semibold'>Submit</div>

                            </div>

                        </div>


                    </div>
                    <div>

                    </div>
                </div>

            }


            {/* delete user */}
            {openDeleteDialog &&
                <div className='fixed inset-0 z-10 p-4  flex items-center justify-center '>
                    {/* overlay */}
                    <div onClick={() => { SetOpenUserform(false) }} className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'></div>

                    {/* content */}
                    <div className='relative  bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 p-4 '>
                        <h2 className='text-xl font-bold text-gray-800 w-full text-center'>Delete User</h2>

                        <div className='w-full flex items-center justify-center p-4 flex-col gap-5 '>

                            <p>Confirm deletion of user '{selectedUser?.name}'</p>

                        

                            


                            <div className='w-full mt-5 flex justify-center gap-10 cursor-pointer items-center'>
                                <p onClick={() => { SetopenDeleteDialog(false) }} className='text-sm text-gray-800'>Cancel</p>
                                <div onClick={() => { DeleteUser() }} className='px-2 py-2 rounded-xl bg-red-600 text-white font-semibold'>Delete</div>

                            </div>

                        </div>


                    </div>
                    <div>

                    </div>
                </div>

            }





        </div>
    )
}

export default Users_section
