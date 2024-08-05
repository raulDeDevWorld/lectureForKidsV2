'use client'
import dynamic from "next/dynamic";

const Component = dynamic(
  () => import("@/components/Component"),
  { ssr: false }
);
function Home() {

   

    return (
        <div className='relative bg-gradient-to-tr from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen w-screen p-10'>
          
          <Component></Component>
        </div>
    )
}
export default Home





















