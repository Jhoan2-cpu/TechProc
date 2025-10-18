import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { ProfilePage } from "../pages/ProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { LMSMainPage } from "../modules/lms/pages/LMSMainPage";
import { TicketsMainPage } from "../modules/tickets/pages/TicketsMainPage";
import {
  SecurityDashboardPage,
  SessionsPage,
  BlockedIPsPage,
  BlockedUsersPage,
  IncidentsPage,
  BackupsPage,
} from "../modules/security/pages";
import { InfrastructureMainPage } from "../modules/infrastructure/pages/InfrastructureMainPage";
import { WebPage } from "../modules/web/pages/WebPage";
import { AnalyticsMainPage } from "../modules/analytics/pages/AnalyticsMainPage";
import { UsersPage } from "../modules/users/pages/UsersPage";
import { PendingRegistrationsPage } from "../modules/users/pages/PendingRegistrationsPage";
import { Breadcrumb } from "../shared/components/Breadcrumb";
import type { User } from "../shared/types/auth";
import { hasAccess } from "../shared/utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faUserCircle,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { modules } from "../shared/utils/modules";
import { LogoutModal } from "../shared/components/LogoutModal";
import { SidebarNavigation } from "../shared/components/Navigation";

// Layout Component
export default function Layout({
  currentUser,
  onLogout,
}: {
  currentUser: User;
  onLogout: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const handleModuleChange = (module: string) => {
    navigate(`/${module}`);
  };

  const currentPath = location.pathname.split("/")[1] || "";

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-r-full shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/15 hover:scale-110 transition-all duration-300 ${
          isSidebarOpen ? "left-[276px]" : "left-4"
        }`}
        aria-label={isSidebarOpen ? "Ocultar sidebar" : "Mostrar sidebar"}
      >
        <FontAwesomeIcon
          icon={isSidebarOpen ? faTimes : faBars}
          className="text-lg"
        />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-secondary-500 to-secondary-700 shadow-2xl border-r border-primary-500/30 flex flex-col h-screen sticky top-0 transition-all duration-300 ${
          isSidebarOpen ? "w-72" : "w-0 -translate-x-full"
        }`}
      >
        <div
          className={`${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 flex flex-col h-full`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-primary-500/20 flex-shrink-0">
            <div className="flex flex-col items-center gap-3">
              <div className="text-center">
                <h1 className="text-4xl font-heading font-bold text-gradient mb-2">
                  INCADEV
                </h1>
                <p className="text-sm text-gray-300 leading-tight">
                  Instituto de Capacitación
                  <br />y Desarrollo Virtual
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-primary-500/20 bg-gradient-to-br from-primary-600/20 to-primary-700/20 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
                <span className="text-white font-bold text-lg">
                  {currentUser.first_name.charAt(0)}{currentUser.last_name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{currentUser.first_name} {currentUser.last_name}</p>
                <p className="text-xs text-gray-300">
                  {currentUser.role[0].replace(/_/g, " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <SidebarNavigation
            modules={modules}
            currentUser={currentUser}
            currentPath={currentPath}
            hasAccess={hasAccess}
            onModuleChange={handleModuleChange}
          />

          {/* Profile & Logout Section */}
          <div className="p-4 border-t border-primary-500/20 space-y-2 flex-shrink-0">
            {/* Profile Button */}
            <button
              onClick={() => handleModuleChange("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                currentPath === "profile"
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/15 hover:scale-105"
                  : "text-gray-300 hover:bg-gradient-to-r hover:from-secondary-600 hover:to-secondary-700 hover:text-white hover:shadow-lg hover:scale-105 border border-gray-700/30 hover:border-primary-500/50"
              }`}
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-lg" />
              <span className="font-medium">Mi Perfil</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center bg-danger-500 gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger-400 transition-all duration-300 hover:shadow-lg hover:shadow-danger/30 hover:scale-105 border border-gray-700/30 hover:border-danger/50"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutModal
          show={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            onLogout();
          }}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen bg-gradient-to-br from-dark-600/50 to-smoky-600/50 backdrop-blur-sm">
        <div className="p-12">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 animate-fade-in">
            <Breadcrumb />
          </div>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/website" replace />} />
            <Route path="/profile" element={<ProfilePage user={currentUser} />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/pending-registrations" element={<PendingRegistrationsPage />} />
            <Route path="/lms-dashboard" element={<LMSMainPage />} />
            <Route path="/lms-courses" element={<LMSMainPage />} />
            <Route path="/lms-students" element={<LMSMainPage />} />
            <Route path="/lms-instructors" element={<LMSMainPage />} />
            <Route path="/tickets-dashboard" element={<TicketsMainPage />} />
            <Route path="/tickets-my-tickets" element={<TicketsMainPage />} />
            <Route path="/tickets-available" element={<TicketsMainPage />} />
            <Route path="/tickets-escalations" element={<TicketsMainPage />} />
            <Route path="/security-dashboard" element={<SecurityDashboardPage />} />
            <Route path="/security-sessions" element={<SessionsPage />} />
            <Route path="/security-blocked-ips" element={<BlockedIPsPage />} />
            <Route path="/security-blocked-users" element={<BlockedUsersPage />} />
            <Route path="/security-incidents" element={<IncidentsPage />} />
            <Route path="/security-backups" element={<BackupsPage />} />
            <Route path="/infrastructure-dashboard" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-servers" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-licenses" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-storage" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-software" element={<InfrastructureMainPage />} />
            <Route path="/web-dashboard" element={<WebPage />} />
            <Route path="/web-news" element={<WebPage />} />
            <Route path="/web-alerts" element={<WebPage />} />
            <Route path="/web-announcements" element={<WebPage />} />
            <Route path="/web-contacts" element={<WebPage />} />
            <Route path="/web-chatbot" element={<WebPage />} />
            <Route path="/analytics-dashboard" element={<AnalyticsMainPage />} />
            <Route path="/analytics-attendance" element={<AnalyticsMainPage />} />
            <Route path="/analytics-progress" element={<AnalyticsMainPage />} />
            <Route path="/analytics-performance" element={<AnalyticsMainPage />} />
            <Route path="/analytics-dropout" element={<AnalyticsMainPage />} />
            <Route path="/analytics-reports" element={<AnalyticsMainPage />} />

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
