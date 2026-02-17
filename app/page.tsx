import Image from "next/image";
import Header from "./Components/Header";
import { Store, User } from "lucide-react";
// import Orders from "./Components/Orders";
import Stores from "./Components/Stores";
import Users from "./Components/Users";
import Products from "./Components/Products";
import Store_section from "./Components/Store_section";
import Users_section from "./Components/Users_section";
import Products_section from "./Components/Products_section";
import Order_section from "./Components/Order_section";

// export default function Home() {
//   return (
//     <main className="w-full h-full flex flex-col">

//       <div className="w-full">
//         <Header/>
//       </div>

//       <div className="w-full flex gap-5 justify-center p-5">
//         <Users/>
//         <Stores/>
//         <Orders/>

//       </div>
//       <Products/>

//     </main>
//   );
// }
export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col bg-slate-50">
      {/* Top Navigation */}
      <Header />

      {/* Dashboard Content Grid */}
      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Management Section (Users & Stores) */}
        <div className="flex flex-col gap-6">
          <Users_section />
          <Store_section />
        </div>

        {/* Live Operations (Orders) */}
        <div className="xl:col-span-2">
          <Products_section />
        </div>

        {/* Inventory Section (Full Width Bottom) */}
        <div className="xl:col-span-3">
          
           <Order_section />
        </div>
        
      </div>
      <div className="h-[100px]"></div>
    </main>
  );
}