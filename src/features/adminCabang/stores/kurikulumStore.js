// src/features/adminCabang/stores/kurikulumStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ENTITIES } from './masterDataStore';

// Kurikulum types and statuses
const KURIKULUM_TYPES = {
  NASIONAL: 'nasional',
  DAERAH: 'daerah',
  SEKOLAH: 'sekolah',
  CUSTOM: 'custom'
};

const KURIKULUM_STATUS = {
  DRAFT: 'draft',
  REVIEW: 'review',
  APPROVED: 'approved',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
};

const useKurikulumStore = create(
  devtools(
    (set, get) => ({
      // ==================== STATE ====================
      
      // Kurikulum entities
      kurikulum: {},
      
      // Kurikulum-Materi assignments (junction table)
      kurikulumMateri: {},
      
      // Kurikulum templates for quick setup
      templates: {},
      
      // Assignment workflows
      assignments: {
        pending: {}, // Pending materi assignments
        approved: {}, // Approved assignments
        rejected: {} // Rejected assignments
      },
      
      // Validation rules for kurikulum
      validationRules: {
        materiMinimum: {
          [ENTITIES.JENJANG]: 1, // Minimum materi per jenjang
          global: 5 // Global minimum
        },
        materiMaximum: {
          [ENTITIES.JENJANG]: 50, // Maximum materi per jenjang
          global: 200 // Global maximum
        },
        requiredKategori: ['wajib'], // Required mata pelajaran categories
        optionalKategori: ['muatan_lokal', 'pengembangan_diri']
      },
      
      // Analytics and statistics
      analytics: {
        coverage: {}, // Coverage per jenjang/mata pelajaran
        usage: {}, // Usage statistics
        performance: {}, // Performance metrics
        trends: {} // Usage trends
      },
      
      // Workflow states
      workflow: {
        currentStep: null,
        steps: [
          'select_jenjang',
          'assign_mata_pelajaran',
          'assign_materi',
          'validate_assignments',
          'review_kurikulum',
          'finalize'
        ],
        completedSteps: [],
        errors: {}
      },
      
      // ==================== COMPUTED GETTERS ====================
      
      // Get kurikulum by ID with full relations
      getKurikulumById: (id) => {
        const kurikulum = get().kurikulum[id];
        if (!kurikulum) return null;
        
        // Get assigned materi
        const assignedMateri = Object.values(get().kurikulumMateri)
          .filter(assignment => assignment.id_kurikulum === id);
        
        return {
          ...kurikulum,
          assignedMateri,
          materiCount: assignedMateri.length
        };
      },
      
      // Get kurikulum by status
      getKurikulumByStatus: (status) => {
        return Object.values(get().kurikulum)
          .filter(item => item.status === status)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      },
      
      // Get active kurikulum
      getActiveKurikulum: () => {
        return get().getKurikulumByStatus(KURIKULUM_STATUS.ACTIVE);
      },
      
      // Get kurikulum templates
      getTemplates: () => {
        return Object.values(get().templates)
          .sort((a, b) => a.name.localeCompare(b.name));
      },
      
      // Get materi assignments for kurikulum
      getMateriAssignments: (kurikulumId) => {
        return Object.values(get().kurikulumMateri)
          .filter(assignment => assignment.id_kurikulum === kurikulumId)
          .sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
      },
      
      // Get coverage analysis
      getCoverageAnalysis: (kurikulumId) => {
        const assignments = get().getMateriAssignments(kurikulumId);
        const analysis = {
          totalMateri: assignments.length,
          byJenjang: {},
          byMataPelajaran: {},
          byKelas: {},
          gaps: [],
          recommendations: []
        };
        
        // Group by different dimensions
        assignments.forEach(assignment => {
          const { materi } = assignment;
          if (!materi) return;
          
          // By jenjang
          const jenjangId = materi.kelas?.id_jenjang;
          if (jenjangId) {
            if (!analysis.byJenjang[jenjangId]) {
              analysis.byJenjang[jenjangId] = 0;
            }
            analysis.byJenjang[jenjangId]++;
          }
          
          // By mata pelajaran
          const mpId = materi.id_mata_pelajaran;
          if (mpId) {
            if (!analysis.byMataPelajaran[mpId]) {
              analysis.byMataPelajaran[mpId] = 0;
            }
            analysis.byMataPelajaran[mpId]++;
          }
          
          // By kelas
          const kelasId = materi.id_kelas;
          if (kelasId) {
            if (!analysis.byKelas[kelasId]) {
              analysis.byKelas[kelasId] = 0;
            }
            analysis.byKelas[kelasId]++;
          }
        });
        
        return analysis;
      },
      
      // ==================== ACTIONS ====================
      
      actions: {
        // Load kurikulum data
        loadKurikulum: async (params = {}) => {
          try {
            // TODO: Implement API call when kurikulum API is ready
            // const response = await kurikulumApi.getAll(params);
            // For now, return empty data
            return { success: true, data: [] };
          } catch (error) {
            throw error;
          }
        },
        
        // Create new kurikulum
        createKurikulum: async (data) => {
          try {
            // TODO: Implement API call when kurikulum API is ready
            const newKurikulum = {
              id_kurikulum: Date.now().toString(),
              ...data,
              status: KURIKULUM_STATUS.DRAFT,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            set(state => ({
              kurikulum: {
                ...state.kurikulum,
                [newKurikulum.id_kurikulum]: newKurikulum
              }
            }), false, 'kurikulum/create');
            
            return { success: true, data: newKurikulum };
          } catch (error) {
            throw error;
          }
        },
        
        // Update kurikulum
        updateKurikulum: async (id, data) => {
          try {
            set(state => ({
              kurikulum: {
                ...state.kurikulum,
                [id]: {
                  ...state.kurikulum[id],
                  ...data,
                  updated_at: new Date().toISOString()
                }
              }
            }), false, `kurikulum/update/${id}`);
            
            return { success: true, data: get().kurikulum[id] };
          } catch (error) {
            throw error;
          }
        },
        
        // Delete kurikulum
        deleteKurikulum: async (id) => {
          try {
            // Check if kurikulum can be deleted
            const kurikulum = get().kurikulum[id];
            if (kurikulum?.status === KURIKULUM_STATUS.ACTIVE) {
              throw new Error('Tidak dapat menghapus kurikulum yang sedang aktif');
            }
            
            // Remove kurikulum and its assignments
            set(state => {
              const newKurikulum = { ...state.kurikulum };
              delete newKurikulum[id];
              
              const newAssignments = { ...state.kurikulumMateri };
              Object.keys(newAssignments).forEach(assignmentId => {
                if (newAssignments[assignmentId].id_kurikulum === id) {
                  delete newAssignments[assignmentId];
                }
              });
              
              return {
                kurikulum: newKurikulum,
                kurikulumMateri: newAssignments
              };
            }, false, `kurikulum/delete/${id}`);
            
            return { success: true };
          } catch (error) {
            throw error;
          }
        },
        
        // Assign materi to kurikulum
        assignMateri: async (kurikulumId, materiId, assignmentData = {}) => {
          try {
            const assignmentId = `${kurikulumId}_${materiId}`;
            const assignment = {
              id: assignmentId,
              id_kurikulum: kurikulumId,
              id_materi: materiId,
              urutan: assignmentData.urutan || 1,
              is_required: assignmentData.is_required ?? true,
              bobot: assignmentData.bobot || 1.0,
              status: 'active',
              assigned_at: new Date().toISOString(),
              ...assignmentData
            };
            
            set(state => ({
              kurikulumMateri: {
                ...state.kurikulumMateri,
                [assignmentId]: assignment
              }
            }), false, `kurikulum/assignMateri/${assignmentId}`);
            
            return { success: true, data: assignment };
          } catch (error) {
            throw error;
          }
        },
        
        // Remove materi assignment
        removeMateriAssignment: async (kurikulumId, materiId) => {
          try {
            const assignmentId = `${kurikulumId}_${materiId}`;
            
            set(state => {
              const newAssignments = { ...state.kurikulumMateri };
              delete newAssignments[assignmentId];
              
              return { kurikulumMateri: newAssignments };
            }, false, `kurikulum/removeAssignment/${assignmentId}`);
            
            return { success: true };
          } catch (error) {
            throw error;
          }
        },
        
        // Bulk assign materi
        bulkAssignMateri: async (kurikulumId, materiIds, assignmentData = {}) => {
          try {
            const assignments = {};
            
            materiIds.forEach((materiId, index) => {
              const assignmentId = `${kurikulumId}_${materiId}`;
              assignments[assignmentId] = {
                id: assignmentId,
                id_kurikulum: kurikulumId,
                id_materi: materiId,
                urutan: assignmentData.startUrutan ? assignmentData.startUrutan + index : index + 1,
                is_required: assignmentData.is_required ?? true,
                bobot: assignmentData.bobot || 1.0,
                status: 'active',
                assigned_at: new Date().toISOString()
              };
            });
            
            set(state => ({
              kurikulumMateri: {
                ...state.kurikulumMateri,
                ...assignments
              }
            }), false, `kurikulum/bulkAssign/${kurikulumId}`);
            
            return { success: true, data: Object.values(assignments) };
          } catch (error) {
            throw error;
          }
        },
        
        // Validate kurikulum completeness
        validateKurikulum: (kurikulumId) => {
          const kurikulum = get().kurikulum[kurikulumId];
          if (!kurikulum) return { isValid: false, errors: ['Kurikulum tidak ditemukan'] };
          
          const assignments = get().getMateriAssignments(kurikulumId);
          const coverage = get().getCoverageAnalysis(kurikulumId);
          const rules = get().validationRules;
          const errors = [];
          const warnings = [];
          
          // Check minimum materi requirement
          if (assignments.length < rules.materiMinimum.global) {
            errors.push(`Minimum ${rules.materiMinimum.global} materi diperlukan`);
          }
          
          // Check maximum materi limit
          if (assignments.length > rules.materiMaximum.global) {
            errors.push(`Maksimum ${rules.materiMaximum.global} materi diizinkan`);
          }
          
          // Check required categories coverage
          const assignedKategori = new Set();
          assignments.forEach(assignment => {
            const kategori = assignment.materi?.mataPelajaran?.kategori;
            if (kategori) assignedKategori.add(kategori);
          });
          
          rules.requiredKategori.forEach(kategori => {
            if (!assignedKategori.has(kategori)) {
              errors.push(`Kategori mata pelajaran '${kategori}' harus ada`);
            }
          });
          
          // Check jenjang distribution
          Object.entries(coverage.byJenjang).forEach(([jenjangId, count]) => {
            if (count < rules.materiMinimum[ENTITIES.JENJANG]) {
              warnings.push(`Jenjang ${jenjangId} memiliki terlalu sedikit materi`);
            }
          });
          
          return {
            isValid: errors.length === 0,
            errors,
            warnings,
            coverage,
            summary: {
              totalMateri: assignments.length,
              jenjangCovered: Object.keys(coverage.byJenjang).length,
              mataPelajaranCovered: Object.keys(coverage.byMataPelajaran).length,
              kategoriCovered: assignedKategori.size
            }
          };
        },
        
        // Change kurikulum status
        changeStatus: async (kurikulumId, newStatus) => {
          try {
            const kurikulum = get().kurikulum[kurikulumId];
            if (!kurikulum) throw new Error('Kurikulum tidak ditemukan');
            
            // Validate status transition
            const allowedTransitions = {
              [KURIKULUM_STATUS.DRAFT]: [KURIKULUM_STATUS.REVIEW, KURIKULUM_STATUS.ARCHIVED],
              [KURIKULUM_STATUS.REVIEW]: [KURIKULUM_STATUS.APPROVED, KURIKULUM_STATUS.DRAFT],
              [KURIKULUM_STATUS.APPROVED]: [KURIKULUM_STATUS.ACTIVE, KURIKULUM_STATUS.REVIEW],
              [KURIKULUM_STATUS.ACTIVE]: [KURIKULUM_STATUS.ARCHIVED],
              [KURIKULUM_STATUS.ARCHIVED]: [KURIKULUM_STATUS.DRAFT]
            };
            
            const allowed = allowedTransitions[kurikulum.status];
            if (!allowed || !allowed.includes(newStatus)) {
              throw new Error(`Tidak dapat mengubah status dari ${kurikulum.status} ke ${newStatus}`);
            }
            
            // If activating, validate completeness
            if (newStatus === KURIKULUM_STATUS.ACTIVE) {
              const validation = get().actions.validateKurikulum(kurikulumId);
              if (!validation.isValid) {
                throw new Error(`Kurikulum tidak valid: ${validation.errors.join(', ')}`);
              }
              
              // Deactivate other active kurikulum of same type
              Object.values(get().kurikulum).forEach(other => {
                if (other.id_kurikulum !== kurikulumId && 
                    other.status === KURIKULUM_STATUS.ACTIVE &&
                    other.type === kurikulum.type) {
                  get().actions.changeStatus(other.id_kurikulum, KURIKULUM_STATUS.ARCHIVED);
                }
              });
            }
            
            await get().actions.updateKurikulum(kurikulumId, { 
              status: newStatus,
              status_changed_at: new Date().toISOString()
            });
            
            return { success: true };
          } catch (error) {
            throw error;
          }
        },
        
        // Load templates
        loadTemplates: async () => {
          try {
            // TODO: Load from API or predefined templates
            const defaultTemplates = {
              'template_sd': {
                id: 'template_sd',
                name: 'Template Kurikulum SD',
                description: 'Template standar untuk Sekolah Dasar',
                type: KURIKULUM_TYPES.NASIONAL,
                jenjang: ['SD'],
                materiAssignments: []
              },
              'template_smp': {
                id: 'template_smp',
                name: 'Template Kurikulum SMP',
                description: 'Template standar untuk Sekolah Menengah Pertama',
                type: KURIKULUM_TYPES.NASIONAL,
                jenjang: ['SMP'],
                materiAssignments: []
              }
            };
            
            set({ templates: defaultTemplates }, false, 'kurikulum/loadTemplates');
            
            return { success: true, data: Object.values(defaultTemplates) };
          } catch (error) {
            throw error;
          }
        },
        
        // Create kurikulum from template
        createFromTemplate: async (templateId, customData = {}) => {
          try {
            const template = get().templates[templateId];
            if (!template) throw new Error('Template tidak ditemukan');
            
            const kurikulumData = {
              nama_kurikulum: customData.nama_kurikulum || `${template.name} - ${new Date().getFullYear()}`,
              type: template.type,
              deskripsi: customData.deskripsi || template.description,
              ...customData
            };
            
            const result = await get().actions.createKurikulum(kurikulumData);
            
            // Apply template assignments if any
            if (template.materiAssignments && template.materiAssignments.length > 0) {
              const materiIds = template.materiAssignments.map(a => a.id_materi);
              await get().actions.bulkAssignMateri(result.data.id_kurikulum, materiIds);
            }
            
            return result;
          } catch (error) {
            throw error;
          }
        },
        
        // Clear all kurikulum data
        clear: () => {
          set({
            kurikulum: {},
            kurikulumMateri: {},
            templates: {},
            assignments: {
              pending: {},
              approved: {},
              rejected: {}
            },
            analytics: {
              coverage: {},
              usage: {},
              performance: {},
              trends: {}
            },
            workflow: {
              currentStep: null,
              completedSteps: [],
              errors: {}
            }
          }, false, 'kurikulum/clear');
        }
      }
    }),
    {
      name: 'kurikulum-store',
      serialize: true
    }
  )
);

// Export constants for use in components
export { KURIKULUM_TYPES, KURIKULUM_STATUS };
export default useKurikulumStore;