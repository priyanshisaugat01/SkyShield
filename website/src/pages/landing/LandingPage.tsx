import NoiseOverlay from '../../components/effects/NoiseOverlay'
import MouseSpotlight from '../../components/effects/MouseSpotlight'
import CustomCursor from '../../components/effects/CustomCursor'
import SkipLink from '../../components/SkipLink'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/sections/Hero'
import PlatformPreview from '../../components/sections/PlatformPreview'
import SecurityOperationsDashboard from '../../components/sections/SecurityOperationsDashboard'
import Architecture from '../../components/sections/Architecture'
import SecurityFeatures from '../../components/sections/SecurityFeatures'
import ComplianceAutomation from '../../components/sections/ComplianceAutomation'
import AIThreatIntelligence from '../../components/sections/AIThreatIntelligence'
import LiveMonitoring from '../../components/sections/LiveMonitoring'
import DevSecOpsWorkflow from '../../components/sections/DevSecOpsWorkflow'

export default function LandingPage() {
  return (
    <>
      <NoiseOverlay />
      <MouseSpotlight />
      <CustomCursor />
      <SkipLink />
      <Navbar />
      <main id="main-content" className="relative z-10">
        <Hero />
        <PlatformPreview />
        <SecurityOperationsDashboard />
        <Architecture />
        <SecurityFeatures />
        <ComplianceAutomation />
        <AIThreatIntelligence />
        <LiveMonitoring />
        <DevSecOpsWorkflow />
      </main>
      <Footer />
    </>
  )
}
