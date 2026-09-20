import { FiFacebook, FiInstagram} from 'react-icons/fi'
import { BsTwitterX } from "react-icons/bs";
import { RxDiscordLogo } from "react-icons/rx";
export default function SocialIcons() {
  const iconClass = 'h-5 w-5'
  const itemClass = 'inline-flex items-center justify-center h-9 w-9 rounded-full bg-sand-100 text-soil-800 hover:bg-sand-200'
  return (
    <div className="flex items-center gap-3">
      <a href="#" aria-label="Instagram" className={itemClass}><FiInstagram className={iconClass} /></a>
      <a href="#" aria-label="Twitter" className={itemClass}> <BsTwitterX className={iconClass} /></a>
      <a href="#" aria-label="Facebook" className={itemClass}><FiFacebook className={iconClass} /></a>
      <a href="#" aria-label="Facebook" className={itemClass}><RxDiscordLogo className={iconClass} /></a>
                 
    </div>
  )
}


