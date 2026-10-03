import { useState } from "react"
import { siteData, visibleLink } from "../siteData"
import { CloseIcon, MenuIcon } from "./icons"

export function Navbar({ home }: { home: string }) {
  const [open, setOpen] = useState(false)
  const { brand, accessibility, navigation } = siteData
  const links = navigation.filter(visibleLink)
  const action = siteData.hero.actions.find(visibleLink)
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-6">
      <div className="nav-glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5">
        {brand.enabled && <a href={home} className="flex min-h-11 items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"><img src={brand.icon} alt="" width="44" height="44" className="h-11 w-11" />{brand.name}</a>}
        <nav aria-label={accessibility.primaryNav} className="hidden items-center gap-1 md:flex">{links.map(link => <a key={link.href} href={link.href} className="rounded-full px-4 py-3 text-sm text-white/75 hover:text-white">{link.label}</a>)}</nav>
        {action && <a href={action.href} className="brand-button hidden rounded-full px-5 py-3 text-sm font-medium md:block">{action.label}</a>}
        {links.length > 0 && <button type="button" aria-label={open ? accessibility.closeMenu : accessibility.openMenu} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)} className="ml-auto flex h-11 w-11 items-center justify-center md:hidden">{open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}</button>}
      </div>
      {open && <nav id="mobile-nav" aria-label={accessibility.mobileNav} className="nav-glass mt-2 flex flex-col rounded-2xl p-3 md:hidden">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3">{link.label}</a>)}</nav>}
    </header>
  )
}
