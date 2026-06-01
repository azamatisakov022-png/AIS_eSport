import { Routes, Route, Navigate } from 'react-router-dom'

// Internal portal
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Athletes from './pages/Athletes'
import Coaches from './pages/Coaches'
import Judges from './pages/Judges'
import Organizations from './pages/Organizations'
import Facilities from './pages/Facilities'
import Events from './pages/Events'
import Teams from './pages/Teams'
import Applications from './pages/Applications'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import TrainerApplications from './pages/TrainerApplications'
import AwardApplications from './pages/AwardApplications'
import ApplicationReview from './pages/ApplicationReview'
import Staff from './pages/Staff'
import MedicalCertificates from './pages/MedicalCertificates'
import Inventory from './pages/Inventory'

// Intranet (corporate portal for staff)
import IntranetHome from './intranet/IntranetHome'
import IntranetPlaceholder from './intranet/IntranetPlaceholder'
import { IntranetNewsList, IntranetNewsDetail } from './intranet/IntranetNews'
import IntranetAnnouncements from './intranet/IntranetAnnouncements'
import IntranetDirectory from './intranet/IntranetDirectory'
import IntranetStructure from './intranet/IntranetStructure'
import IntranetRegulations from './intranet/IntranetRegulations'
import IntranetKnowledge from './intranet/IntranetKnowledge'
import IntranetTemplates from './intranet/IntranetTemplates'
import IntranetCalendar from './intranet/IntranetCalendar'
import IntranetChat from './intranet/IntranetChat'
import IntranetRoutes from './intranet/IntranetRoutes'
import IntranetApprovals from './intranet/IntranetApprovals'
import IntranetCMS from './intranet/IntranetCMS'

// Cabinet (unified personal account)
import CabinetLayout from './cabinet/CabinetLayout'
import CabinetDashboard from './cabinet/CabinetDashboard'
import CabinetPage from './cabinet/CabinetPage'

// Public portal
import PublicLayout from './public/PublicLayout'
import PublicHome from './public/PublicHome'
import PublicVerify from './public/PublicVerify'
import PublicLogin from './public/PublicLogin'
import PublicLoginPlayground from './public/PublicLoginPlayground'
import PublicTickets from './public/PublicTickets'
import PublicTicketEvent from './public/PublicTicketEvent'
import PublicStatistics from './public/PublicStatistics'
import PublicTrainerRegistration from './public/PublicTrainerRegistration'
import PublicJudgeCategory from './public/PublicJudgeCategory'
import PublicDocumentRestoration from './public/PublicDocumentRestoration'
import PublicCoaches from './public/PublicCoaches'
import PublicAthletes from './public/PublicAthletes'
import PublicAthleteProfile from './public/PublicAthleteProfile'
import PublicJudges from './public/PublicJudges'
import PublicAwardApplication from './public/PublicAwardApplication'
import PublicEvents from './public/PublicEvents'
import PublicEventDetail from './public/PublicEventDetail'
import PublicOrganizations from './public/PublicOrganizations'
import PublicCabinet from './public/PublicCabinet'
import PublicFacilities from './public/PublicFacilities'
import PublicSchools from './public/PublicSchools'
import PublicNPA from './public/PublicNPA'
import PublicCabinetLayout from './public/PublicCabinetLayout'
import PublicHomeMockup from './public/PublicHomeMockup'
import PublicTeams from './public/PublicTeams'

// Public content pages (раскрытые placeholder'ы)
import { PublicNewsList, PublicNewsDetail } from './public/pages/PublicNews'
import PublicAbout from './public/pages/PublicAbout'
import PublicBudget from './public/pages/PublicBudget'
import PublicCalendarPlan from './public/pages/PublicCalendarPlan'
import PublicSports from './public/pages/PublicSports'
import PublicAnnouncements from './public/pages/PublicAnnouncements'
import PublicServices from './public/pages/PublicServices'
import PublicAntidoping from './public/pages/PublicAntidoping'
import PublicAnticorruption from './public/pages/PublicAnticorruption'
import PublicReception from './public/pages/PublicReception'
import { PublicDiscussionsList, PublicDiscussionDetail } from './public/pages/PublicDiscussions'
import PublicLinks from './public/pages/PublicLinks'

export default function App() {
    return (
        <Routes>
            {/* Root → redirect to public portal */}
            <Route path="/" element={<Navigate to="/public" replace />} />

            {/* Internal Portal */}
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/athletes" element={<Athletes />} />
                <Route path="/coaches" element={<Coaches />} />
                <Route path="/judges" element={<Judges />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/events" element={<Events />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/medical-certificates" element={<MedicalCertificates />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/trainer-applications" element={<TrainerApplications />} />
                <Route path="/award-applications" element={<AwardApplications />} />
                <Route path="/award-applications/:id" element={<ApplicationReview />} />
                <Route path="/settings" element={<Settings />} />

                {/* Intranet — internal corporate portal */}
                <Route path="/intranet" element={<IntranetHome />} />
                <Route path="/intranet/news" element={<IntranetNewsList />} />
                <Route path="/intranet/news/:id" element={<IntranetNewsDetail />} />
                <Route path="/intranet/structure" element={<IntranetStructure />} />
                <Route path="/intranet/directory" element={<IntranetDirectory />} />
                <Route path="/intranet/regulations" element={<IntranetRegulations />} />
                <Route path="/intranet/knowledge" element={<IntranetKnowledge />} />
                <Route path="/intranet/templates" element={<IntranetTemplates />} />
                <Route path="/intranet/chat" element={<IntranetChat />} />
                <Route path="/intranet/announcements" element={<IntranetAnnouncements />} />
                <Route path="/intranet/calendar" element={<IntranetCalendar />} />
                <Route path="/intranet/routes" element={<IntranetRoutes />} />
                <Route path="/intranet/approvals" element={<IntranetApprovals />} />
                <Route path="/intranet/cms" element={<IntranetCMS />} />
            </Route>

            {/* Cabinet - unified personal account for athlete/coach/judge */}
            <Route path="/cabinet" element={<CabinetLayout />}>
                <Route index element={<CabinetDashboard />} />
                {/* Athlete sections */}
                <Route path="passport" element={<CabinetPage section="passport" />} />
                <Route path="medical" element={<CabinetPage section="medical" />} />
                <Route path="training" element={<CabinetPage section="training" />} />
                <Route path="coaches" element={<CabinetPage section="coaches" />} />
                <Route path="medals" element={<CabinetPage section="medals" />} />
                {/* Coach sections */}
                <Route path="certificate" element={<CabinetPage section="certificate" />} />
                <Route path="athletes" element={<CabinetPage section="athletes" />} />
                {/* Judge sections */}
                <Route path="license" element={<CabinetPage section="license" />} />
                <Route path="category" element={<CabinetPage section="category" />} />
                {/* Shared sections */}
                <Route path="events" element={<CabinetPage section="events" />} />
                <Route path="team" element={<CabinetPage section="team" />} />
                <Route path="applications" element={<CabinetPage section="applications" />} />
                <Route path="notifications" element={<CabinetPage section="notifications" />} />
                {/* Org specific sections */}
                <Route path="facilities" element={<CabinetPage section="facilities" />} />
            </Route>

            {/* Login - standalone, no layout wrapper */}
            <Route path="/public/login" element={<PublicLogin />} />
            <Route path="/public/login-playground" element={<PublicLoginPlayground />} />
            <Route path="/mockup" element={<PublicHomeMockup />} />

            {/* Cabinet layout - personal cabinet (header + sidebar) */}
            <Route path="/public" element={<PublicCabinetLayout />}>
                <Route path="cabinet" element={<PublicCabinet />} />
            </Route>

            {/* Public External Portal */}
            <Route path="/public" element={<PublicLayout />}>
                <Route index element={<PublicHome />} />
                <Route path="verify" element={<PublicVerify />} />
                <Route path="news" element={<PublicNewsList />} />
                <Route path="news/:id" element={<PublicNewsDetail />} />
                <Route path="about" element={<PublicAbout />} />
                <Route path="npa" element={<PublicNPA />} />
                <Route path="budget" element={<PublicBudget />} />
                <Route path="calendar" element={<PublicCalendarPlan />} />
                <Route path="events" element={<PublicEvents />} />
                <Route path="events/:id" element={<PublicEventDetail />} />
                <Route path="tickets" element={<PublicTickets />} />
                <Route path="tickets/:id" element={<PublicTicketEvent />} />
                <Route path="statistics" element={<PublicStatistics />} />
                <Route path="schools" element={<PublicSchools />} />
                <Route path="athletes" element={<PublicAthletes />} />
                <Route path="athletes/:id" element={<PublicAthleteProfile />} />
                <Route path="coaches" element={<PublicCoaches />} />
                <Route path="teams" element={<PublicTeams />} />
                <Route path="judges" element={<PublicJudges />} />
                <Route path="organizations" element={<PublicOrganizations />} />
                <Route path="sports" element={<PublicSports />} />
                <Route path="facilities" element={<PublicFacilities />} />
                <Route path="announcements" element={<PublicAnnouncements />} />
                <Route path="services" element={<PublicServices />} />
                <Route path="trainer-registration" element={<PublicTrainerRegistration />} />
                <Route path="award-application" element={<PublicAwardApplication />} />
                <Route path="judge-category" element={<PublicJudgeCategory />} />
                <Route path="document-restoration" element={<PublicDocumentRestoration />} />
                <Route path="antidoping" element={<PublicAntidoping />} />
                <Route path="anticorruption" element={<PublicAnticorruption />} />
                <Route path="reception" element={<PublicReception />} />
                <Route path="discussions" element={<PublicDiscussionsList />} />
                <Route path="discussions/:id" element={<PublicDiscussionDetail />} />
                <Route path="links" element={<PublicLinks />} />
            </Route>
        </Routes>
    )
}
