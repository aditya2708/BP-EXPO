import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import tutorReducer from '../features/adminShelter/redux/tutorSlice';
import tutorCompetencyReducer from '../features/adminShelter/redux/tutorCompetencySlice';
import tutorHonorReducer from '../features/adminShelter/redux/tutorHonorSlice';
import tutorHonorSettingsReducer from '../features/adminPusat/redux/tutorHonorSettingsSlice';
import qrTokenReducer from '../features/adminShelter/redux/qrTokenSlice';
import attendanceReducer from '../features/adminShelter/redux/attendanceSlice';
import aktivitasReducer from '../features/adminShelter/redux/aktivitasSlice';
import penilaianReducer from '../features/adminShelter/redux/penilaianSlice';
import raportReducer from '../features/adminShelter/redux/raportSlice';
import semesterReducer from '../features/adminShelter/redux/semesterSlice';
import kurikulumShelterReducer from '../features/adminShelter/redux/kurikulumShelterSlice';
import tutorAttendaceReducer from '../features/adminShelter/redux/tutorAttendanceSlice';
import laporanReducer from '../features/adminShelter/redux/laporanSlice';
import tutorLaporanReducer from '../features/adminShelter/redux/tutorLaporanSlice';
import cpbLaporanReducer from '../features/adminShelter/redux/cpbLaporanSlice';
import raportLaporanReducer from '../features/adminShelter/redux/raportLaporanSlice';
import laporanSuratReducer from '../features/adminShelter/redux/laporanSuratSlice';
import laporanAktivitasReducer from '../features/adminShelter/redux/laporanAktivitasSlice';
import historiLaporanReducer from '../features/adminShelter/redux/historiLaporanSlice';
import kurikulumReducer from '../features/adminCabang/redux/kurikulumSlice';
import mataPelajaranReducer from '../features/adminCabang/redux/mataPelajaranSlice';
import jenjangReducer from '../features/adminCabang/redux/jenjangSlice';
import kelasReducer from '../features/adminCabang/redux/kelasSlice';
import materiReducer from '../features/adminCabang/redux/materiSlice';

const appReducer = combineReducers({
  auth: authReducer,
  tutor: tutorReducer,
  tutorCompetency: tutorCompetencyReducer,
  tutorHonor: tutorHonorReducer,
  tutorHonorSettings: tutorHonorSettingsReducer,
  qrToken: qrTokenReducer,
  attendance: attendanceReducer,
  aktivitas: aktivitasReducer,
  penilaian: penilaianReducer,
  raport: raportReducer,
  semester: semesterReducer,
  kurikulumShelter: kurikulumShelterReducer,
  tutorAttendance: tutorAttendaceReducer,
  laporan: laporanReducer,
  tutorLaporan: tutorLaporanReducer,
  cpbLaporan: cpbLaporanReducer,
  raportLaporan: raportLaporanReducer,
  laporanSurat: laporanSuratReducer,
  laporanAktivitas: laporanAktivitasReducer,
  historiLaporan: historiLaporanReducer,
  kurikulum: kurikulumReducer,
  mataPelajaran: mataPelajaranReducer,
  jenjang: jenjangReducer,
  kelas: kelasReducer,
  materi: materiReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout/fulfilled') {
    return appReducer(undefined, action);
  }
  
  return appReducer(state, action);
};

export default rootReducer;