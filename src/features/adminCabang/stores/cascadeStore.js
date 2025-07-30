// src/features/adminCabang/stores/cascadeStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import useMasterDataStore, { ENTITIES } from './masterDataStore';

const useCascadeStore = create(
  devtools(
    (set, get) => ({
      // ==================== STATE ====================
      
      // Selected values for cascade filtering
      selected: {
        jenjang: null,
        mataPelajaran: null,
        kelas: null,
        materi: null
      },
      
      // Applied filters
      filters: {
        jenjang: null,
        mataPelajaran: null,
        kelas: null,
        kategori: null,
        status: 'aktif',
        search: ''
      },
      
      // Validation state
      validation: {
        isValidMataPelajaran: true,
        isValidKelas: true,
        isValidMateri: true,
        errors: {}
      },
      
      // ==================== COMPUTED GETTERS ====================
      
      // Get available jenjang options
      getJenjangOptions: () => {
        const masterData = useMasterDataStore.getState();
        return masterData.getEntitiesArray(ENTITIES.JENJANG)
          .filter(item => item.is_active !== false)
          .sort((a, b) => (a.urutan || 0) - (b.urutan || 0))
          .map(item => ({
            label: item.nama_jenjang,
            value: item.id_jenjang?.toString(),
            subtitle: item.kode_jenjang,
            badge: `Urutan ${item.urutan}`,
            data: item
          }));
      },
      
      // Get mata pelajaran options filtered by jenjang
      getMataPelajaranOptions: (jenjangId = null) => {
        const masterData = useMasterDataStore.getState();
        const selectedJenjang = jenjangId || get().selected.jenjang;
        
        let mataPelajaran = masterData.getEntitiesArray(ENTITIES.MATA_PELAJARAN)
          .filter(item => item.status === 'aktif');
        
        // Filter by jenjang if selected (optional dependency)
        if (selectedJenjang) {
          mataPelajaran = mataPelajaran.filter(item => 
            !item.id_jenjang || item.id_jenjang.toString() === selectedJenjang.toString()
          );
        }
        
        return mataPelajaran
          .sort((a, b) => a.nama_mata_pelajaran.localeCompare(b.nama_mata_pelajaran))
          .map(item => ({
            label: item.nama_mata_pelajaran,
            value: item.id_mata_pelajaran?.toString(),
            subtitle: item.kode_mata_pelajaran,
            badge: item.kategori,
            data: item
          }));
      },
      
      // Get kelas options filtered by jenjang
      getKelasOptions: (jenjangId = null) => {
        const masterData = useMasterDataStore.getState();
        const selectedJenjang = jenjangId || get().selected.jenjang;
        
        if (!selectedJenjang) return [];
        
        return masterData.getEntitiesArray(ENTITIES.KELAS)
          .filter(item => 
            item.id_jenjang?.toString() === selectedJenjang.toString() &&
            item.is_active !== false
          )
          .sort((a, b) => (a.urutan || 0) - (b.urutan || 0))
          .map(item => ({
            label: item.nama_kelas,
            value: item.id_kelas?.toString(),
            subtitle: `${item.jenis_kelas} - Urutan ${item.urutan}`,
            badge: item.jenjang?.kode_jenjang || 'Unknown',
            data: item
          }));
      },
      
      // Get materi options with triple dependency (mataPelajaran + kelas)
      getMateriOptions: (mataPelajaranId = null, kelasId = null) => {
        const masterData = useMasterDataStore.getState();
        const selectedMataPelajaran = mataPelajaranId || get().selected.mataPelajaran;
        const selectedKelas = kelasId || get().selected.kelas;
        
        if (!selectedMataPelajaran || !selectedKelas) return [];
        
        return masterData.getEntitiesArray(ENTITIES.MATERI)
          .filter(item => 
            item.id_mata_pelajaran?.toString() === selectedMataPelajaran.toString() &&
            item.id_kelas?.toString() === selectedKelas.toString()
          )
          .sort((a, b) => a.nama_materi.localeCompare(b.nama_materi))
          .map(item => ({
            label: item.nama_materi,
            value: item.id_materi?.toString(),
            subtitle: `${item.mataPelajaran?.nama_mata_pelajaran} - ${item.kelas?.nama_kelas}`,
            data: item
          }));
      },
      
      // Get kategori mata pelajaran options
      getKategoriOptions: () => [
        { label: 'Mata Pelajaran Wajib', value: 'wajib' },
        { label: 'Muatan Lokal', value: 'muatan_lokal' },
        { label: 'Pengembangan Diri', value: 'pengembangan_diri' },
        { label: 'Mata Pelajaran Pilihan', value: 'pilihan' },
        { label: 'Ekstrakurikuler', value: 'ekstrakurikuler' }
      ],
      
      // Get filtered results based on current filters
      getFilteredResults: (entityType) => {
        const masterData = useMasterDataStore.getState();
        const { filters } = get();
        
        let results = masterData.getEntitiesWithRelations(entityType);
        
        // Apply jenjang filter
        if (filters.jenjang && entityType !== ENTITIES.JENJANG) {
          results = results.filter(item => 
            item.id_jenjang?.toString() === filters.jenjang.toString() ||
            item.jenjang?.id_jenjang?.toString() === filters.jenjang.toString() ||
            item.kelas?.id_jenjang?.toString() === filters.jenjang.toString()
          );
        }
        
        // Apply mata pelajaran filter
        if (filters.mataPelajaran && entityType === ENTITIES.MATERI) {
          results = results.filter(item => 
            item.id_mata_pelajaran?.toString() === filters.mataPelajaran.toString()
          );
        }
        
        // Apply kelas filter
        if (filters.kelas && entityType === ENTITIES.MATERI) {
          results = results.filter(item => 
            item.id_kelas?.toString() === filters.kelas.toString()
          );
        }
        
        // Apply kategori filter for mata pelajaran
        if (filters.kategori && entityType === ENTITIES.MATA_PELAJARAN) {
          results = results.filter(item => item.kategori === filters.kategori);
        }
        
        // Apply status filter
        if (filters.status) {
          results = results.filter(item => {
            const status = item.status || (item.is_active === false ? 'tidak_aktif' : 'aktif');
            return status === filters.status;
          });
        }
        
        // Apply search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          results = results.filter(item => {
            const searchFields = [
              item.nama_jenjang,
              item.nama_mata_pelajaran,
              item.nama_kelas,
              item.nama_materi,
              item.kode_jenjang,
              item.kode_mata_pelajaran
            ].filter(Boolean);
            
            return searchFields.some(field => 
              field.toLowerCase().includes(searchTerm)
            );
          });
        }
        
        return results;
      },
      
      // ==================== ACTIONS ====================
      
      actions: {
        // Set selected value and trigger cascade updates
        setSelected: (type, value) => {
          set(state => {
            const newSelected = { ...state.selected };
            
            // Update the selected value
            newSelected[type] = value;
            
            // Clear dependent selections
            if (type === 'jenjang') {
              newSelected.mataPelajaran = null;
              newSelected.kelas = null;
              newSelected.materi = null;
            } else if (type === 'mataPelajaran' || type === 'kelas') {
              newSelected.materi = null;
            }
            
            return {
              selected: newSelected,
              validation: get().actions.validateCascade(newSelected)
            };
          }, false, `cascade/setSelected/${type}`);
        },
        
        // Set filter value
        setFilter: (type, value) => {
          set(state => ({
            filters: {
              ...state.filters,
              [type]: value
            }
          }), false, `cascade/setFilter/${type}`);
        },
        
        // Set multiple filters at once
        setFilters: (filters) => {
          set(state => ({
            filters: {
              ...state.filters,
              ...filters
            }
          }), false, 'cascade/setFilters');
        },
        
        // Clear all filters
        clearFilters: () => {
          set({
            filters: {
              jenjang: null,
              mataPelajaran: null,
              kelas: null,
              kategori: null,
              status: 'aktif',
              search: ''
            }
          }, false, 'cascade/clearFilters');
        },
        
        // Clear all selected values
        clearSelected: () => {
          set({
            selected: {
              jenjang: null,
              mataPelajaran: null,
              kelas: null,
              materi: null
            },
            validation: {
              isValidMataPelajaran: true,
              isValidKelas: true,
              isValidMateri: true,
              errors: {}
            }
          }, false, 'cascade/clearSelected');
        },
        
        // Validate cascade dependencies
        validateCascade: (selected = null) => {
          const current = selected || get().selected;
          const validation = {
            isValidMataPelajaran: true,
            isValidKelas: true,
            isValidMateri: true,
            errors: {}
          };
          
          // Validate mata pelajaran dependency
          if (current.mataPelajaran && current.jenjang) {
            const masterData = useMasterDataStore.getState();
            const mataPelajaran = masterData.getEntityById(ENTITIES.MATA_PELAJARAN, current.mataPelajaran);
            
            if (mataPelajaran?.id_jenjang && 
                mataPelajaran.id_jenjang.toString() !== current.jenjang.toString()) {
              validation.isValidMataPelajaran = false;
              validation.errors.mataPelajaran = 'Mata pelajaran tidak sesuai dengan jenjang yang dipilih';
            }
          }
          
          // Validate kelas dependency
          if (current.kelas && current.jenjang) {
            const masterData = useMasterDataStore.getState();
            const kelas = masterData.getEntityById(ENTITIES.KELAS, current.kelas);
            
            if (!kelas || kelas.id_jenjang?.toString() !== current.jenjang.toString()) {
              validation.isValidKelas = false;
              validation.errors.kelas = 'Kelas tidak sesuai dengan jenjang yang dipilih';
            }
          }
          
          // Validate materi triple dependency
          if (current.materi && (current.mataPelajaran || current.kelas)) {
            const masterData = useMasterDataStore.getState();
            const materi = masterData.getEntityById(ENTITIES.MATERI, current.materi);
            
            if (current.mataPelajaran && 
                materi?.id_mata_pelajaran?.toString() !== current.mataPelajaran.toString()) {
              validation.isValidMateri = false;
              validation.errors.materi = 'Materi tidak sesuai dengan mata pelajaran yang dipilih';
            }
            
            if (current.kelas && 
                materi?.id_kelas?.toString() !== current.kelas.toString()) {
              validation.isValidMateri = false;
              validation.errors.materi = 'Materi tidak sesuai dengan kelas yang dipilih';
            }
          }
          
          return validation;
        },
        
        // Check if entities are compatible
        areCompatible: (entityType1, id1, entityType2, id2) => {
          const masterData = useMasterDataStore.getState();
          const entity1 = masterData.getEntityById(entityType1, id1);
          const entity2 = masterData.getEntityById(entityType2, id2);
          
          if (!entity1 || !entity2) return false;
          
          // Check jenjang compatibility
          if (entityType1 === ENTITIES.JENJANG || entityType2 === ENTITIES.JENJANG) {
            const jenjangId = entityType1 === ENTITIES.JENJANG ? id1 : id2;
            const otherEntity = entityType1 === ENTITIES.JENJANG ? entity2 : entity1;
            
            return !otherEntity.id_jenjang || 
                   otherEntity.id_jenjang.toString() === jenjangId.toString();
          }
          
          // Check mata pelajaran + kelas compatibility for materi
          if ((entityType1 === ENTITIES.MATA_PELAJARAN && entityType2 === ENTITIES.KELAS) ||
              (entityType1 === ENTITIES.KELAS && entityType2 === ENTITIES.MATA_PELAJARAN)) {
            const mp = entityType1 === ENTITIES.MATA_PELAJARAN ? entity1 : entity2;
            const kelas = entityType1 === ENTITIES.KELAS ? entity1 : entity2;
            
            // If mata pelajaran has specific jenjang, kelas must match
            return !mp.id_jenjang || mp.id_jenjang.toString() === kelas.id_jenjang.toString();
          }
          
          return true;
        },
        
        // Get available options based on current selections
        getAvailableOptions: (targetType) => {
          const state = get();
          
          switch (targetType) {
            case ENTITIES.JENJANG:
              return state.getJenjangOptions();
            case ENTITIES.MATA_PELAJARAN:
              return state.getMataPelajaranOptions();
            case ENTITIES.KELAS:
              return state.getKelasOptions();
            case ENTITIES.MATERI:
              return state.getMateriOptions();
            default:
              return [];
          }
        }
      }
    }),
    {
      name: 'cascade-store',
      serialize: true
    }
  )
);

export default useCascadeStore;