
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import HomePage from './app/page';
import ProgramListPage from './app/program/page';
import ProgramDetailPage from './app/program/[id]/page';
import ArchivePage from './app/archive/page';
import ArchiveUploadPage from './app/archive/upload/page';
import KaderPage from './app/kader/page';
import KaderAddPage from './app/kader/add/page';
import KaderEditPage from './app/kader/edit/[id]/page';
import RenjaPage from './app/renja/page';
import ImpactPage from './app/impact/page';
import ContentPage from './app/content/page';
import ContentTemplatePage from './app/content/template/[id]/page';
import ReportPage from './app/report/page';
import YearlyReportPage from './app/report/tahun/page';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="program" element={<ProgramListPage />} />
          <Route path="program/:id" element={<ProgramDetailPage />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="archive/upload" element={<ArchiveUploadPage />} />
          <Route path="kader" element={<KaderPage />} />
          <Route path="kader/add" element={<KaderAddPage />} />
          <Route path="kader/edit/:id" element={<KaderEditPage />} />
          <Route path="renja" element={<RenjaPage />} />
          <Route path="impact" element={<ImpactPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="content/template/:id" element={<ContentTemplatePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="report/tahun" element={<YearlyReportPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
