import { NavLink } from 'react-router-dom'

type Props = {
  isAuthenticated: boolean
  orientation?: 'horizontal' | 'vertical'
}

export default function NavLinks({ isAuthenticated, orientation = 'horizontal' }: Props) {
  const base = 'text-soil-800 hover:text-soil-900 px-3 py-2 rounded-md hover:bg-sand-100 transition'
  const wrap = orientation === 'horizontal' ? 'flex items-center gap-6' : 'flex flex-col gap-3'

  if (!isAuthenticated) {
    return (
      <div className={wrap}>
        <NavLink to="/" className={base}>Home</NavLink>
        <NavLink to="/browse" className={base}>Browse Books</NavLink>
        <NavLink to="/around-me" className={base}>AroundMe</NavLink>
        <NavLink to="/how-it-works" className={base}>How It Works</NavLink>
      </div>
    )
  }

  return (
    <div className={wrap}>
      <NavLink to="/" className={base}>Home</NavLink>
      <NavLink to="/browse" className={base}>Browse</NavLink>
      <NavLink to="/around-me" className={base}>AroundMe</NavLink>
      <NavLink to="/dashboard" className={base}>Dashboard</NavLink>
    </div>
  )
}


