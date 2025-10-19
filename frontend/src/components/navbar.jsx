import {Link} from "react-router";
import {PlusIcon} from "lucide-react";

const Navbar = () => {
  return (
    <header className='bg-base-300 border-b border-b-black'>
        <div className='mx-auto max-w-6xl p-4'>
            <div className='flex items-center justify-between border-r-4'>
                <h1 className='text-3xl font-bold text-primary font-mono tracking-tight  bg-green-500 rounded-b-xl'>ThinkBoard</h1>
            <div className='flex items-center gap-4 bg-green-400 rounded-b-xl'>
           <Link to={"/create"} className='btn btn-primary'>
           <PlusIcon className="size-5"/>
           <span>New Note</span>
           </Link>
            </div>
            </div>
        </div>
    </header>
  )
}

export default Navbar