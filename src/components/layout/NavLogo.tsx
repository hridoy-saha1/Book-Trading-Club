import {Link} from "react-router-dom"
export default function NavLogo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-4xl">
      <img
        src="https://i.postimg.cc/MZMVDkG2/Untitled-design-2.png"
        alt="ShelfShare logo"
        className="h-16 w-16 rounded"
      />
      <span className="text-lg font-semibold text-black dark:text-white">ShelfShare</span>
    </Link>
  )
}


