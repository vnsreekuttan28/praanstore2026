'use client'
import { Plus, Search, ShoppingCart, Trash, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { addOrder, cancelOrder, deleteOrder, fetchOrders, OrderItem, OrderModel, OrderStatus } from '../Models/OrderModel'
import { fetchUsers, UserModel } from '../Models/UserModel'
import { fetchStore, StoreModel } from '../Models/StoreModel'
import { fetchProducts, ProductModel } from '../Models/ProductsModel'
import { indianRupeesFormat } from '../Constants'

const Order_section = () => {
    const [_currentOrders, SetCurrentOrders] = useState<OrderModel[]>([])
    const [_filteredOrders, SetFilteredOrders] = useState<OrderModel[]>([])
    const [userslist, Setuserslist] = useState<UserModel[]>([])
    const [storelist, Setstorelist] = useState<StoreModel[]>([])
    const [Openorderform, SetOpenOrderform] = useState(false)
    const [searchquery, setSearchQuery] = useState('')
    const [input_orderid, Set_input_orderid] = useState('')
    const [input_orderasiigedto, Set_input_orderassigedto] = useState('')
    const [input_storeid, Set_inputstoreid] = useState('')
    const [input_customername, Set_input_customername] = useState('')
    const [input_customercontact, Set_input_customercontat] = useState('')
    const [istsoreCustomer, Setisstorecustomer] = useState(true)
    const [_currentProducts, Setcurrentproducts] = useState<ProductModel[]>([])
    const [choosenProducts, Setchoosenproducts] = useState<ProductModel[]>([])

    const [choosenproduct_id, Setchoosenproduct_id] = useState('')
    const [choosenproduct_name, Setchoosenproduct_name] = useState('')
    const [choosenproduct_price, Setchoosenproduct_price] = useState('')
    const [choosenproduct_qty, Setchoosenproduct_qty] = useState('')
    const [choosenproduct_total, Setchoosenproduct_total] = useState('')

    const [choosenGrandtotal, Setchoosengrandtotal] = useState('')
    const [Refresh, Setrefresh] = useState(false)

    const [openDeleteDialog, SetopenDeleteDialog]=useState(false);

    const [selectedorder, SetselectedOrder]=useState<OrderModel>()
    const [isfetched, Setisfetched]=useState(false);

    useEffect(() => {
        
        Set_input_orderid(formatTimestamp);
        getuserslist();
        getstorelist();
        getproductsList();
        getOrders();
        Setisfetched(true)




    }, [Refresh])

    useEffect(()=>{
        filterOrders()

    },[_currentOrders,searchquery])

    const filterOrders=()=>{

        const querry=searchquery.toLowerCase();
        const filteredOrdes=_currentOrders.filter((order)=>{
            return(
                order.customer.name.toLowerCase().includes(querry) || 
                order.customer.contact.toLowerCase().includes(querry) || 
                order.assiged_to.name.toLowerCase().includes(querry) || 
                order.id.toLowerCase().includes(querry) || 
                order.order_status.toLowerCase().includes(querry) 
            )
        })
        SetFilteredOrders(filteredOrdes)
    }

    const getOrders=async()=>{
        const orders=await fetchOrders();
        SetCurrentOrders(orders)
    }

    const formatTimestamp = () => {
        const now = new Date();
        const datePart = now.toISOString().replace('T', ' ').replace('Z', '');
        return `${datePart}000`; // Simulated microseconds for precision ID
    };

    const openOrderform = () => {
        Set_input_orderid(formatTimestamp)
        SetOpenOrderform(true)
        Setrefresh(!Refresh)
    }



    const getuserslist = async () => {
        const users = await fetchUsers()
        Setuserslist(users)

        if (userslist.length > 0 && !input_orderasiigedto) {
            Set_input_orderassigedto(userslist[0].id);
        }
    }

    const getstorelist = async () => {
        const store = await fetchStore()
        Setstorelist(store)

        if (storelist.length > 0 && !input_storeid) {
            Set_inputstoreid(storelist[0].id);
            changeSelectedStore(storelist[0].id)
        }
    }

    const getproductsList = async () => {
        const products = await fetchProducts()
        Setcurrentproducts(products)

    }

    const addtochoosenlist = () => {
        console.log(choosenproduct_name)
        const c_product = _currentProducts.find((p) => {
            return p.product_name === choosenproduct_name;
        })
        if (choosenproduct_name.length < 2 ||
            choosenproduct_qty.length < 1 ||
            choosenproduct_price.length < 1) {
            alert('Incomplte entry')
            return;
        }


        const total = Number(choosenproduct_price) * Number(choosenproduct_qty)

        const product = {

            id: c_product?.id ?? "",
            product_name: choosenproduct_name,
            unit_price: choosenproduct_price,
            qty: choosenproduct_qty,
            img: "",
            status: "",

            total: total.toString()
        }

        if (product) {


            Setchoosenproduct_total(total.toString())


            Setchoosenproducts((prev) => {
                if (prev.some((p) => p.id === product.id)) {

                    return prev;
                }
                return [...prev, product];
            })

            Setchoosenproduct_name('');
            Setchoosenproduct_price('');
            Setchoosenproduct_qty('');
            Setchoosenproduct_id('');
        }

    }

    const unchoose = (product: ProductModel) => {
        Setchoosenproducts((prev) =>
            prev.filter((p) => p.id !== product.id)
        );
    }

    useEffect(() => {
        const grandtotal = choosenProducts.reduce((sum, p) => {
            return sum + (Number(p.total) || 0);
        }, 0);

        Setchoosengrandtotal(grandtotal.toString())

    }, [choosenProducts])


    const closeOrderForm = () => {
        Setchoosenproducts([])
        Set_input_orderid('')
        Set_input_customercontat('')
        Set_input_customername('')
        Set_input_orderassigedto('')
        Set_inputstoreid('')
        SetOpenOrderform(false);
        Setrefresh(!Refresh)


    }

    const changeSelectedStore = (id: string) => {
        Set_inputstoreid(id);

        const store = storelist.find((store) =>{
             return store.id === id
        })
        if(store){
             Set_input_customername(store.name)
             Set_input_customercontat(store.contact)
        }

       

    }

    const submitOrder = async () => {

        const _payment = {
            total: choosenGrandtotal,
            received: "",
            balance: ""
        }
        const _timestamp = {
            created: formatTimestamp(),
            completed: ""
        }
        const _orderItems: OrderItem[] = choosenProducts.map((product, index) => {
            return {
                price: product.unit_price,
                product_id: product.id,
                product_name: product.product_name,
                qty: product.qty ?? "0",
                status: "string",
            }
        })

        const _customer = {
            name: input_customername,
            contact: input_customercontact
        }
        const assinedperson={
            id:input_orderasiigedto,
            name:userslist.find((user)=>{
                return user.id===input_orderasiigedto
            })?.name??''
        }


        const order = {
            id: input_orderid,
            assiged_by: "Admin",
            assiged_to: assinedperson,
            payment: _payment,
            timestamp: _timestamp,
            order_items: _orderItems,
            order_status: OrderStatus.Assigned,
            note: "",
            customer: _customer,
            store_id: input_storeid
        }

        await addOrder(order).then(() => {
            closeOrderForm();

        })
    }

    const EditOrder=(order:OrderModel)=>{
        const getchoosenproducts=order.order_items.map((item)=>{
            return{                

            id: item.product_id ?? "",
            product_name: item.product_name,
            unit_price: item.price,
            qty: item.qty,
            img: "",
            status: "",

            total: (Number(item.price) * Number(item.qty)).toString()    

            }
        })



         Setchoosenproducts(getchoosenproducts)
        Set_input_orderid(order.id)
        Set_input_customercontat(order.customer.contact)
        Set_input_customername(order.customer.name)
        Set_input_orderassigedto(order.assiged_to.id)
        Set_inputstoreid(order.store_id)
        SetOpenOrderform(true);
        

    }
    const PreapreDeleteOrder=async(order:OrderModel)=>{
        SetselectedOrder(order)
        SetopenDeleteDialog(true)
       

    }
    const DeleteOrder=async()=>{
        if(selectedorder){
            await cancelOrder(selectedorder).then(()=>{
                  SetopenDeleteDialog(false)
                  Setrefresh(!Refresh)
            })




            // await deleteOrder(selectedorder).then(()=>{
            //       SetopenDeleteDialog(false)
            //       Setrefresh(!Refresh)
            // })
        }
     
        
    }




    return (
        <div className='w-full flex flex-col border-2 border-gray-500 rounded-xl p-4 max-h-[1000px] '>

            {/* Header */}
            <div className='w-full flex items-center gap-5 '>
                <div className='bg-green-100 text-green-700 rounded-xl p-3'>
                    <ShoppingCart size={24} />
                </div>

                <div className='flex flex-col gap-2'>
                    <h1 className='font-bold text-xl'>Live Orders</h1>
                    <p className='text-sm text-gray-500'>{_currentOrders.length} Orders found</p>
                </div>



                <div className='flex flex-1 flex-row-reverse'>
                    <div onClick={() => { openOrderform() }} className={`px-4 py-2 bg-green-600 rounded-xl text-white cursor-pointer hover:bg-green-700 hover:shadow ${isfetched?"flex":"hidden"}`}>+Add New</div>
                </div>

            </div>

            <div className='w-full p-2 flex gap-2 items-center bg-gray-200 rounded-xl mt-5'>
                <Search size={20} />
                <input  onChange={(e) => { setSearchQuery(e.target.value) }} placeholder='Search users with name or contact or id' className='w-full  p-2 border-0 focus:outline-none text-sm ring-0 ' />

            </div>

            



            {/* list */}
            <div className='grid grid-cols-4 gap-5 mt-10 overflow-y-scroll   [&::-webkit-scrollbar]:hidden '>
                {_filteredOrders.map((order, index) => {

                    console.log("filtered ordes"+_filteredOrders.length)

                    return <div onClick={() => {EditOrder(order) }} key={index} className=' border-2 border-gray-300 w-full px-4 py-2 bg-green-50 rounded-xl cursor-pointer hover:shadow-sm hover:border-green-200'>
                        <div className='w-full flex flex-col gap-2'>
                            <p className='text-xs text-green-500 font-mono'>#{order.id}</p>
                            <div className='flex gap-3 justify-between '> 
                                <h1 className='text-xs p-2 bg-yellow-50 rounded-md'>Assigend to: {order.assiged_to.name} - #{order.assiged_to.id}</h1>
                                <div className='flex flex-col '>
                                     <div className={`text-[10px] ${order.order_status.includes('Delivered')?"bg-green-500":order.order_status.includes('Cancel')?"bg-red-400":"bg-yellow-200"} flex flex-col px-2 rounded-xl`}>{order.order_status}</div>
                                </div>
                             
                             
                            </div>
                           
                            <h1 className='text-md font-semibold mt-3'>{order.customer.name}</h1>
                            <div className='w-full flex justify-between'>
                                <p className='text-sm text-gray-700'>Ordered Items: {order.order_items.length}</p>
                                <Trash onClick={(e)=>{e.stopPropagation(); PreapreDeleteOrder(order)}} size={15} color='red' className='hover:bg-red-100 '/>

                            </div>
                            

                            <div className=' text-sm font-bold border-t border-dashed border-gray-500 pt-2  flex justify-between '>
                              <p className='text-green-700'>Amount: {indianRupeesFormat.format(Number(order.payment.total))}</p> 
                              <p className='text-orange-400'>Credit: {indianRupeesFormat.format(Number(order.payment.balance))}</p> 
                              
                            </div>
                        







                        </div>
                    </div>
                })}

            </div>

            {Openorderform &&
                <div className='fixed inset-0 z-10 p-4  flex items-center justify-center '>
                    {/* overlay */}
                    <div onClick={() => { SetOpenOrderform(false) }} className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'></div>

                    {/* content */}
                    <div className='relative  bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 '>
                        <div className='p-4 flex flex-col gap-5'>

                            <h1 className='w-full text-lg font-semibold border-b border-gray-100'>Order</h1>

                        </div>

                        <div className='w-full xl:flex gap-5 p-4'>

                            {/* left section */}
                            <div className='xl:w-1/3 flex flex-col gap-5 border-r-2 border-gray-300 p-4'>

                                <div className='flex flex-col w-full '>
                                    <h1 className='text-sm'>Order ID (auto-assiged)</h1>
                                    <input onChange={(e) => { Set_input_orderid(e.target.value) }} defaultValue={input_orderid} readOnly={true} disabled={true} className='w-full px-2 py-2 bg-gray-200 border-2 text-sm rounded-xl' />
                                </div>

                                <div className='flex flex-col w-full '>
                                    <div className='flex gap-2 items-center '>
                                        <User size={15} />
                                        <h1 className='text-sm'>Distribution Agent</h1>
                                    </div>

                                    <select value={input_orderasiigedto} onChange={(e) => { Set_input_orderassigedto(e.target.value) }} className='p-2 bg-gray-200 rounded-xl mt-2 text-sm'>
                                        {userslist.map((user, i) => (
                                            <option key={i} value={user.id}>{user.name} [Id: {user.id}]</option>
                                        ))}

                                    </select>

                                </div>

                                <div className='bg-white border-2 border-gray-100 rounded-xl p-2'>



                                    <div className='w-full flex justify-center gap-4 px-2 text-sm'>
                                        <div onClick={() => { Setisstorecustomer(true) }} className={`px-2 ${istsoreCustomer ? 'bg-black text-white' : 'bg-gray-200'} cursor-pointer rounded-xl`}>Store</div>
                                        <div onClick={() => { Setisstorecustomer(false) }} className={`px-2 ${!istsoreCustomer ? 'bg-black text-white' : 'bg-gray-200'} cursor-pointer rounded-xl`}>Individual</div>

                                    </div>

                                    {istsoreCustomer &&
                                        <div className='flex flex-col w-full mt-5'>
                                            <h1 className='text-sm'>Store</h1>
                                            <select value={input_storeid} onChange={(e) => { changeSelectedStore(e.target.value) }} className='p-2 bg-gray-200 rounded-xl'>
                                                {storelist.map((store, i) => (
                                                    <option key={i} value={store.id}>{store.name} [Id: {store.id}]</option>
                                                ))}

                                            </select>

                                        </div>}
                                    {!istsoreCustomer &&
                                        <div className='flex flex-col gap-5 w-full mt-5 text-sm'>
                                            <div>
                                                <h1 className='text-sm'>Customer Name*</h1>
                                                <input value={input_customername} onChange={(e) => { Set_input_customername(e.target.value) }} placeholder='Enter cutsomer name' type="text" className='w-full p-2 bg-gray-200 border-2 rounded-xl' />
                                            </div>

                                            <div>
                                                <h1 className='text-sm'>Customer Contact</h1>
                                                <input value={input_customercontact} onChange={(e) => { Set_input_customercontat(e.target.value) }} placeholder='Enter cutsomer contact' type="number" className='w-full p-2 bg-gray-200 border-2 rounded-xl' />
                                            </div>



                                        </div>}


                                </div>
                            </div>




                            {/* right section */}
                            <div className='flex flex-col gap-5'>
                                <h1 className='font-semibold'>Add Items</h1>

                                <div className='w-full flex gap-3 xl:flex-row flex-col'>

                                    <datalist id="products">
                                        {_currentProducts.map((p, i) => (
                                            <option key={i} value={p.product_name}> [id:{p.id}]</option>
                                        ))}
                                    </datalist>
                                    <div>
                                        <p className='text-sm'>Product</p>
                                        <input value={choosenproduct_name} onChange={(e) => { Setchoosenproduct_name(e.target.value) }} className='p-2 bg-gray-200 rounded-xl' list='products' placeholder='Search for Product' type="text" />
                                    </div>

                                    <div>
                                        <p className='text-sm'>Unit price</p>
                                        <input value={choosenproduct_price} onChange={(e) => Setchoosenproduct_price(e.target.value)} className='p-2 bg-gray-200 rounded-xl' placeholder='Price' type="number" />

                                    </div>

                                    <div>
                                        <p className='text-sm'>QTY</p>
                                        <input value={choosenproduct_qty} onChange={(e) => Setchoosenproduct_qty(e.target.value)} className='p-2 bg-gray-200 rounded-xl' placeholder='QTY' type="number" />

                                    </div>

                                    <div onClick={() => { addtochoosenlist() }} className='flex flex-col justify-center items-center w-full cursor-pointer '>
                                        <div className='flex gap-2 p-2 bg-black text-white items-center rounded-xl'>
                                            <Plus size={10} color='white ' />
                                            <p >Add</p>


                                        </div>
                                    </div>




                                </div>

                                <div className='border-2 border-gray-100 rounded-lg'>
                                    <div className=' grid grid-cols-5 p-2  justify-around'>
                                        <div className='text-sm font-semibold'>Item</div>
                                        <div className='text-sm font-semibold'>Price</div>
                                        <div className='text-sm font-semibold'>Qty</div>
                                        <div className='text-sm font-semibold'>Total</div>
                                        <div className='text-sm font-semibold'></div>
                                    </div>

                                    <div className='h-[200px] overflow-y-auto pb-5'>
                                        {choosenProducts.map((product, index) => (
                                            <div key={index} className=' grid grid-cols-5 p-2  justify-around border-b-2 border-gray-200 text-sm text-gray-800'>

                                                <div>{product.product_name}</div>
                                                <div>₹{product.unit_price}</div>
                                                <div>{product.qty ?? "0"}</div>
                                                <div>₹{product.total ?? "0"}</div>
                                                <Trash onClick={() => { unchoose(product) }} color='red' size={15} className='cursor-pointer rounded-lg hover:bg-red-200' />
                                            </div>

                                        ))}
                                    </div>

                                </div>


                                <div className='w-full flex justify-around gap-5 text-sm items-center'>
                                    <h1 onClick={() => { closeOrderForm() }} className='text-gray-700 cursor-pointer'>Cancel</h1>
                                    <div className='text-green-700 font-bold text-lg'>
                                        <h1>Grand Total: ₹{choosenGrandtotal}</h1>
                                    </div>
                                    <div onClick={submitOrder} className=' cursor-pointer p-2 bg-green-200 rounded-xl hover:bg-green-800 hover:text-white'>Submit</div>
                                </div>










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
                                        <h2 className='text-xl font-bold text-gray-800'>Cancel Order</h2>
                                    </div>
            
                                    <div className='flex flex-col gap-5 p-4 items-center'>
                                        <p>Confirm that you want to cancel store '{selectedorder?.id}'</p>
                                        <div className='flex gap-5 items-center cursor-pointer'>
                                            <p onClick={()=>{SetopenDeleteDialog(false) }} className='text-green-500 text-sm'>Cancel</p>
                                            <div onClick={DeleteOrder} className='px-4 py-2 bg-red-500 text-white text-lg font-semibold rounded-xl'>Cancel</div>
            
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

export default Order_section
