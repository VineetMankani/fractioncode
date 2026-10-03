export function SocialIcon({ platform }: { platform: string }) {
  const paths: Record<string, React.ReactNode> = {
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="18" cy="6" r="1" /></>,
    youtube: <><path d="M22 8s-.2-2-1-3c-1-1-3-1-9-1S4 4 3 5C2 6 2 8 2 12s0 6 1 7 3 1 9 1 8 0 9-1 1-3 1-7Z" /><path d="m10 8 6 4-6 4Z" fill="var(--site-bg)" /></>,
    twitter: <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.8-7.3L5.8 22H2.6l8.1-9.3L2 2h6.4l4.4 6.7L18.9 2ZM17.6 20h1.8L7.2 4H5.4Z" />,
    linkedin: <><rect x="2" y="9" width="4" height="13" /><circle cx="4" cy="4" r="2.3" /><path d="M9 9h4v2c1-2 3-2.4 4.6-2.4 4 0 4.4 3 4.4 6.4v7h-4v-7c0-2-.4-3-2-3s-3 1-3 3v7H9Z" /></>,
    facebook: <path d="M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5C17 1 16 1 15 1c-4 0-5 2.5-5 6v2H7v4h3v9Z" />,
    phone: <path d="M6 2 2 4c0 9 9 18 18 18l2-4-6-4-2 3c-3-1-6-4-7-7l3-2Z" />,
    whatsapp: <><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m8 6-2 2c0 5 5 10 10 10l2-2-4-2-1 2c-2-1-4-3-5-5l2-1Z" /></>
  }
  return <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">{paths[platform]}</svg>
}

