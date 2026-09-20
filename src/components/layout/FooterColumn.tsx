import { Link } from 'react-router-dom'

type LinkItem = { label: string; to: string }

export default function FooterColumn({ title, links }: { title: string; links: LinkItem[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-soil-900 dark:text-white uppercase tracking-wide mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-gray-700 hover:text-soil-900 dark:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


