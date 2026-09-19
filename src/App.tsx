import { Capabilities } from "./components/Capabilities"
import { Contact } from "./components/Contact"
import { CustomCursor } from "./components/CustomCursor"
import { GrainOverlay } from "./components/GrainOverlay"
import { Hero } from "./components/Hero"
import { Navbar } from "./components/Navbar"
import { Projects } from "./components/Projects"
import { siteData } from "./siteData"

export default function App() {
  return (
    <div className="relative min-h-screen bg-black font-body text-white">
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <Navbar showProjects={siteData.sections.projects} />
      <main>
        <Hero description={siteData.hero.description} />
        <Capabilities services={siteData.services} />
        {/* Set sections.projects to false in data.json to hide this section and its nav link. */}
        {siteData.sections.projects && <Projects projects={siteData.projects} email={siteData.studio.email} />}
        <Contact {...siteData.studio} {...siteData.contact} />
      </main>
      <GrainOverlay />
      <CustomCursor />
    </div>
  )
}
