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
import PublicPlaceholder from './public/PublicPlaceholder'
import PublicTrainerRegistration from './public/PublicTrainerRegistration'
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
                <Route path="/applications" element={<Applications />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/trainer-applications" element={<TrainerApplications />} />
                <Route path="/award-applications" element={<AwardApplications />} />
                <Route path="/award-applications/:id" element={<ApplicationReview />} />
                <Route path="/settings" element={<Settings />} />
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
                <Route path="news" element={<PublicPlaceholder title="Новости" icon="📰" description="Последние новости ГАФКиС и спортивной жизни Кыргызстана." />} />
                <Route path="about" element={<PublicPlaceholder title="О ГАФКиС" icon="🏛️" description="Структура, руководство, контакты и деятельность агентства." />} />
                <Route path="npa" element={<PublicNPA />} />
                <Route path="budget" element={<PublicPlaceholder title="Программный бюджет" icon="💰" description="Бюджетные программы и финансовая отчётность ГАФКиС." />} />
                <Route path="calendar" element={<PublicPlaceholder title="Календарный план мероприятий" icon="📅" description="Полный календарь спортивных мероприятий Кыргызской Республики." />} />
                <Route path="events" element={<PublicEvents />} />
                <Route path="events/:id" element={<PublicEventDetail />} />
                <Route path="schools" element={<PublicSchools />} />
                <Route path="athletes" element={<PublicAthletes />} />
                <Route path="athletes/:id" element={<PublicAthleteProfile />} />
                <Route path="coaches" element={<PublicCoaches />} />
                <Route path="teams" element={<PublicTeams />} />
                <Route path="judges" element={<PublicJudges />} />
                <Route path="organizations" element={<PublicOrganizations />} />
                <Route path="sports" element={<PublicPlaceholder title="Виды спорта" icon="🎯" description="Признанные виды спорта в Кыргызской Республике." />} />
                <Route path="facilities" element={<PublicFacilities />} />
                <Route path="announcements" element={<PublicPlaceholder title="Объявления" icon="📢" description="Вакансии, тендеры, аренда спортивных объектов." />} />
                <Route path="services" element={<PublicPlaceholder title="Государственные услуги" icon="📋" description="Онлайн-услуги в сфере спорта: заявления, сертификаты, звания." />} />
                <Route path="trainer-registration" element={<PublicTrainerRegistration />} />
                <Route path="award-application" element={<PublicAwardApplication />} />
                <Route path="antidoping" element={<PublicPlaceholder title="Антидопинговая деятельность" icon="🧪" description="Политика, процедуры и контроль антидопинговой деятельности." />} />
                <Route path="anticorruption" element={<PublicPlaceholder title="Антикоррупционные меры" icon="🛡️" description="Противодействие коррупции, обратная связь, отчёты." />} />
                <Route path="reception" element={<PublicPlaceholder title="Интернет-приёмная граждан" icon="📬" description="Подача онлайн-обращений и отслеживание статуса рассмотрения." />} />
            </Route>
        </Routes>
    )
}
