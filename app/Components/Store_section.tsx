'use client'
import React, { useEffect, useState } from 'react'
import { addStore, deactivateStore, deleteStore, fetchStore, StoreModel } from '../Models/StoreModel'
import { fetchOrders, OrderModel } from '../Models/OrderModel';
import { Contact, Store, MapPin, Phone, Plus, X, Loader2, Delete, Trash, Search } from 'lucide-react'


const Store_section = () => {
    const [_currentStores, SetCurrentStore] = useState<StoreModel[]>([]);
    const [_AllStores, SetAllStore] = useState<StoreModel[]>([]);
    const [_filteredStores, SetFilteredStore] = useState<StoreModel[]>([]);
    const [_currentOrders, SetCurrentOrder] = useState<OrderModel[]>([]);
    const [Refresh, SetRefresh] = useState(false);
    const [openStoreform, SetOpenStoreform] = useState(false);
    const [input_storename, Set_input_storename] = useState('');
    const [input_storeid, Set_input_storeid] = useState('');
    const [input_storecontact, Set_input_storecontact] = useState('');
    const [input_storeaddress, Set_input_storeaddress] = useState('');
    const [input_storelocation, Set_input_storelocation] = useState('');
    const [openDeleteDialog, SetopenDeleteDialog] = useState(false);
    const [selectedStore, SetselectedStore] = useState<StoreModel>();
    const[searchQuerry, setSearchQuery]=useState('');
    const [isfetched, Setisfetched]=useState(false);

    useEffect(() => {
        getCurrentStores();
        getOrderList()
        filterStores()
        Setisfetched(true)



    }, [Refresh])

    useEffect(() => {
        
        filterStores()



    }, [ searchQuerry]);

    //getting stores list
    const getCurrentStores = async () => {
        const stores = await fetchStore();
        const active_stores=stores.filter((store)=>{
            return(
                store.status==="active"
            )
        })
        SetCurrentStore(active_stores);
        SetAllStore(stores);
        SetFilteredStore(active_stores)
        Set_input_storeid((stores.length + 1).toString())

    }

    //filter store
    const filterStores=()=>{
        const query=searchQuerry.toLowerCase()
        const s=_currentStores.filter((s)=>{
            return(
            s.name.toLowerCase().includes(query) ||
            s.id.toLowerCase().includes(query) ||
            s.address.toLowerCase().includes(query) 
            );
           

        })

        SetFilteredStore(s)

    }


    //getting Orders list
    const getOrderList = async () => {
        const orders = await fetchOrders();
        SetCurrentOrder(orders);

    }

    //close form
    const Closeform = () => {
        Set_input_storename('');
        Set_input_storeaddress('');
        Set_input_storelocation('');
        Set_input_storecontact('');
        SetOpenStoreform(false);

    }

    //editStoreform
    const EditStore = (store: StoreModel) => {
        Set_input_storeid(store.id);
        Set_input_storename(store.name);
        Set_input_storeaddress(store.address);
        Set_input_storelocation(store.location);
        Set_input_storecontact(store.contact);
        SetOpenStoreform(true);
    }




    //submitting store
    const Submit_store = async () => {
        if (input_storename.length < 2 || input_storeaddress.length < 2) {
            alert("Both store name and address are mandatory")
            return;
        }
        const store = {
            id: input_storeid,
            name: input_storename,
            contact: input_storecontact,
            address: input_storeaddress,
            location: input_storelocation,
            status:"active"
        }
        await addStore(store).then(() => {
            Closeform();
            SetRefresh(!Refresh);

        })

    }

    //delete store
    
    const prepareDelete = async (store: StoreModel) => {
         SetselectedStore(store); 
         SetopenDeleteDialog(true);
         SetOpenStoreform(false);        

    }
    const DeleteStore=async ()=>{

         if(selectedStore){
           deactivateStore(selectedStore).then(()=>{
                SetopenDeleteDialog(false);
                SetRefresh(!Refresh)
            })
        }

    
        // if(selectedStore){
        //     await deleteStore(selectedStore).then(()=>{
        //         SetopenDeleteDialog(false);
        //         SetRefresh(!Refresh)
        //     })
        // }
        
    }

    




    return (
        <div className='w-full flex flex-col border-2 border-gray-500 rounded-xl p-4 '>

            {/* Header */}
            <div className='w-full flex items-center gap-5 '>
                <div className='bg-green-100 text-green-700 rounded-xl p-3'>
                    <Store size={24} />
                </div>

                <div className='flex flex-col gap-2'>
                     <h1 className='font-bold text-xl'>Stores</h1>
                     <p className='text-sm text-gray-500'>{_currentStores.length} active stores found</p>
                </div>

               

                <div className='flex flex-1 flex-row-reverse'>
                    <div onClick={() => { SetOpenStoreform(true) }} className={`px-4 py-2 bg-green-600 rounded-xl text-white cursor-pointer hover:bg-green-700 hover:shadow ${isfetched?"flex":"hidden"}`}>+Add New</div>
                </div>

            </div>

            <div className='w-full p-2 flex gap-2 items-center bg-gray-200 rounded-xl mt-5'>
                <Search size={20}/>
                <input onChange={(e)=>{setSearchQuery(e.target.value)}} placeholder='Search store with name or address or id' className='w-full  p-2 border-0 focus:outline-none text-sm ring-0 '/>

            </div>



            {/* list */}
            <div className='w-full flex flex-col gap-5 mt-10 overflow-y-scroll h-[400px]  [&::-webkit-scrollbar]:hidden '>
                {_filteredStores.map((store, index) => {
                    const storeOrders = _currentOrders.filter((o) => o.store_id == store.id);
                    const credit = _currentOrders.reduce((total, order) => {
                        if (order.store_id === store.id) {
                            total += Number(order.payment.balance);
                        }
                        return total;
                    }, 0)


                    return <div onClick={() => { EditStore(store) }} key={index} className=' border-2 border-gray-300 w-full px-4 py-2 bg-green-50 rounded-xl cursor-pointer hover:shadow-sm hover:border-green-200'>
                        <div className='w-full flex justify-between'>
                            <h1 className='text-lg font-semibold'>{store.name}</h1>
                            <h1 className='text-sm text-gray-500 '>ID:#{store.id}</h1>
                        </div>

                        <div className='w-full flex justify-between'>
                            <p className='text-sm font-light'>{store.address}</p>
                            <div onClick={(e) =>{ e.stopPropagation(); prepareDelete(store); }} className='hover:bg-red-200 rounded-xl p-2 '>
                                <Trash size={20} color='red' className='  rounded-xl' />
                            </div>

                        </div>


                        <div className=' flex justify-between'>
                            <p className='text-sm font-light text-green-500 mt-5'>{storeOrders.length} Orders</p>
                            <p className='text-sm font-light text-orange-500 mt-5'>Credits: Rs. {credit}</p>
                        </div>

                    </div>
                })}

            </div>

            {openStoreform &&
                <div className='fixed inset-0 z-10 p-4  flex items-center justify-center '>
                    {/* overlay */}
                    <div onClick={() => { SetOpenStoreform(false) }} className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'></div>

                    {/* content */}
                    <div className='relative  bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 '>
                        <div className='p-6 border-b flex justify-between items-center'>
                            <h2 className='text-xl font-bold text-gray-800'>Add New Store</h2>
                            <button onClick={() => { SetOpenStoreform(false) }} className='text-gray-400 hover:text-gray-600'><X /></button>
                        </div>

                        <div className='p-4 gap-5 flex flex-col'>

                            <div className='flex flex-col w-full '>
                                <h1 className='text-sm'>STORE ID (auto-assiged)</h1>
                                <input onChange={(e) => { Set_input_storeid(e.target.value) }} defaultValue={input_storeid} readOnly={true} disabled={true} className='w-full px-2 py-4 bg-gray-200 border-2 rounded-xl' />
                            </div>

                            <div className='flex flex-col w-full '>
                                <h1 className='text-sm'>STORE NAME</h1>
                                <input onChange={(e) => { Set_input_storename(e.target.value) }} value={input_storename} className='w-full px-2 py-4 bg-gray-50 border-2 rounded-xl' />
                            </div>

                            <div className='flex flex-col w-full '>
                                <h1 className='text-sm'>STORE CONTACT</h1>
                                <input onChange={(e) => { Set_input_storecontact(e.target.value) }} className='w-full px-2 py-4 bg-gray-50 border-2 rounded-xl' />
                            </div>

                            <div className='flex flex-col w-full '>
                                <h1 className='text-sm'>STORE LOCATION</h1>
                                <input onChange={(e) => { Set_input_storelocation(e.target.value) }} className='w-full px-2 py-4 bg-gray-50 border-2 rounded-xl' />
                            </div>

                            <div className='flex flex-col w-full '>
                                <h1 className='text-sm'>STORE ADDRESS</h1>
                                <textarea onChange={(e) => { Set_input_storeaddress(e.target.value) }} className='w-full px-2 py-4 bg-gray-50 border-2 rounded-xl' />
                            </div>

                            <div className='flex  w-full mt-5 justify-around items-center cursor-pointer'>
                                <h1 onClick={() => { SetOpenStoreform(false) }} className='text-sm text-green-800'>Cancel</h1>
                                <div onClick={() => { Submit_store() }} className='px-4 py-4 bg-green-700 rounded-xl text-white font-semibold'>Submit</div>
                            </div>

                        </div>




                    </div>

                </div>


            }

            {/* delete dialog */}
            {openDeleteDialog &&
                <div className='fixed inset-0 z-10 p-4  flex items-center justify-center '>
                    {/* overlay */}
                    <div onClick={() => { SetopenDeleteDialog(false) }} className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'></div>

                    {/* content */}
                    <div className='relative  bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 '>
                        <div className='p-6 border-b flex gap-5 items-center'>
                            <Trash color='red'/>
                            <h2 className='text-xl font-bold text-gray-800'>Delete Store</h2>
                        </div>

                        <div className='flex flex-col gap-5 p-4 items-center'>
                            <p>Confirm that you want to delete store '{selectedStore?.name}'</p>
                            <div className='flex gap-5 items-center cursor-pointer'>
                                <p onClick={()=>{SetopenDeleteDialog(false) }} className='text-green-500 text-sm'>Cancel</p>
                                <div onClick={DeleteStore} className='px-4 py-2 bg-red-500 text-white text-lg font-semibold rounded-xl'>Delete</div>

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

export default Store_section
