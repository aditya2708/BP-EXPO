import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../../constants/config';

/**
 * RTK Query API for Admin Cabang Kurikulum management
 * Handles all API calls related to kurikulum, materi, and semester
 */
export const kurikulumApi = createApi({
  reducerPath: 'kurikulumApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/admin-cabang`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log('=== RTK QUERY NETWORK DEBUG ===');
      console.log('- Preparing headers for request');
      console.log('- Token exists:', !!token);
      console.log('- Token length:', token ? token.length : 'No token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log('- Authorization header set');
      }
      headers.set('Accept', 'application/json');
      console.log('- Accept header set to application/json');
      return headers;
    },
    fetchFn: async (url, options) => {
      console.log('=== RTK QUERY FETCH DEBUG ===');
      console.log('- URL:', url);
      console.log('- Method:', options?.method || 'GET');
      console.log('- Headers:', options?.headers ? Object.fromEntries(options.headers.entries()) : 'No headers');
      
      try {
        const response = await fetch(url, options);
        console.log('- Response status:', response.status);
        console.log('- Response ok:', response.ok);
        console.log('- Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Always read response body for debugging
        try {
          const responseText = await response.clone().text();
          console.log('- Response body length:', responseText.length);
          console.log('- Response body (first 500 chars):', responseText.substring(0, 500));
          
          // Try to parse as JSON
          const responseJson = JSON.parse(responseText);
          console.log('- Parsed JSON success:', !!responseJson);
          console.log('- JSON keys:', Object.keys(responseJson));
        } catch (parseError) {
          console.log('- JSON parse error:', parseError.message);
          console.log('- Response body (first 200 chars):', responseText?.substring(0, 200));
        }
        
        if (!response.ok) {
          console.log('- Response not ok');
        }
        
        return response;
      } catch (error) {
        console.log('- Fetch error:', error.message);
        console.log('- Error details:', error);
        throw error;
      }
    },
  }),
  tagTypes: ['Kurikulum', 'Materi', 'Semester', 'Statistics'],
  endpoints: (builder) => ({
    // Kurikulum endpoints
    getKurikulumStruktur: builder.query({
      query: () => '/kurikulum/struktur',
      providesTags: ['Kurikulum'],
    }),

    getMataPelajaran: builder.query({
      query: (params) => ({
        url: '/kurikulum/mata-pelajaran',
        params,
      }),
      providesTags: ['Kurikulum'],
    }),

    getKurikulumDropdownData: builder.query({
      query: () => '/kurikulum/dropdown-data',
      providesTags: ['Kurikulum'],
    }),

    getKelasByJenjang: builder.query({
      query: (jenjangId) => `/kurikulum/kelas/${jenjangId}`,
      providesTags: ['Kurikulum'],
    }),

    getKurikulumStatistics: builder.query({
      query: () => '/kurikulum/statistics',
      providesTags: ['Statistics'],
    }),

    // Materi endpoints
    getMateriList: builder.query({
      query: (params) => ({
        url: '/materi',
        params,
      }),
      transformResponse: (response) => {
        console.log('=== RTK QUERY TRANSFORM RESPONSE ===');
        console.log('- Raw response:', response);
        console.log('- Response type:', typeof response);
        console.log('- Response keys:', response ? Object.keys(response) : 'No keys');
        
        if (response && response.success && response.data) {
          console.log('- Success response detected');
          console.log('- Data type:', typeof response.data);
          console.log('- Data keys:', Object.keys(response.data));
          console.log('- Items array length:', response.data.data ? response.data.data.length : 'No data array');
          return response;
        } else {
          console.log('- Unexpected response structure');
          return response;
        }
      },
      providesTags: (result) => {
        console.log('=== RTK QUERY PROVIDE TAGS ===');
        console.log('- Result for tags:', result);
        console.log('- Result.data exists:', !!result?.data);
        console.log('- Result.data.data exists:', !!result?.data?.data);
        
        const materiData = result?.data?.data;
        if (materiData && Array.isArray(materiData)) {
          console.log('- Creating tags for', materiData.length, 'items');
          return [
            ...materiData.map(({ id_materi }) => ({ type: 'Materi', id: id_materi })),
            { type: 'Materi', id: 'LIST' },
          ];
        } else {
          console.log('- No valid data array, returning default tags');
          return [{ type: 'Materi', id: 'LIST' }];
        }
      },
    }),

    getMateri: builder.query({
      query: (id) => `/materi/${id}`,
      providesTags: (result, error, id) => [{ type: 'Materi', id }],
    }),

    createMateri: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        
        // Append all form fields
        Object.keys(data).forEach(key => {
          if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
            if (key === 'file' && data[key]) {
              formData.append('file', data[key]);
            } else {
              formData.append(key, data[key]);
            }
          }
        });

        return {
          url: '/materi',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Materi', id: 'LIST' }, 'Statistics'],
    }),

    updateMateri: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        
        // Append all form fields
        Object.keys(data).forEach(key => {
          if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
            if (key === 'file' && data[key]) {
              formData.append('file', data[key]);
            } else {
              formData.append(key, data[key]);
            }
          }
        });

        return {
          url: `/materi/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Materi', id },
        { type: 'Materi', id: 'LIST' },
        'Statistics',
      ],
    }),

    deleteMateri: builder.mutation({
      query: (id) => ({
        url: `/materi/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Materi', id },
        { type: 'Materi', id: 'LIST' },
        'Statistics',
      ],
    }),

    reorderMateri: builder.mutation({
      query: (materiIds) => ({
        url: '/materi/reorder',
        method: 'POST',
        body: { materi_ids: materiIds },
      }),
      invalidatesTags: [{ type: 'Materi', id: 'LIST' }],
    }),

    // Semester endpoints
    getSemesterList: builder.query({
      query: (params) => ({
        url: '/semester',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id_semester }) => ({ type: 'Semester', id: id_semester })),
              { type: 'Semester', id: 'LIST' },
            ]
          : [{ type: 'Semester', id: 'LIST' }],
    }),

    getSemester: builder.query({
      query: (id) => `/semester/${id}`,
      providesTags: (result, error, id) => [{ type: 'Semester', id }],
    }),

    getActiveSemester: builder.query({
      query: () => '/semester/active',
      providesTags: [{ type: 'Semester', id: 'ACTIVE' }],
    }),

    getSemesterStatistics: builder.query({
      query: () => '/semester/statistics',
      providesTags: ['Statistics'],
    }),

    createSemester: builder.mutation({
      query: (data) => ({
        url: '/semester',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Semester', id: 'LIST' }, 'Statistics'],
    }),

    updateSemester: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/semester/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Semester', id },
        { type: 'Semester', id: 'LIST' },
        { type: 'Semester', id: 'ACTIVE' },
        'Statistics',
      ],
    }),

    deleteSemester: builder.mutation({
      query: (id) => ({
        url: `/semester/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Semester', id },
        { type: 'Semester', id: 'LIST' },
        { type: 'Semester', id: 'ACTIVE' },
        'Statistics',
      ],
    }),

    setActiveSemester: builder.mutation({
      query: (id) => ({
        url: `/semester/${id}/set-active`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'Semester', id: 'LIST' },
        { type: 'Semester', id: 'ACTIVE' },
        'Statistics',
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Kurikulum hooks
  useGetKurikulumStrukturQuery,
  useGetMataPelajaranQuery,
  useGetKurikulumDropdownDataQuery,
  useGetKelasByJenjangQuery,
  useGetKurikulumStatisticsQuery,
  
  // Materi hooks
  useGetMateriListQuery,
  useGetMateriQuery,
  useCreateMateriMutation,
  useUpdateMateriMutation,
  useDeleteMateriMutation,
  useReorderMateriMutation,
  
  // Semester hooks
  useGetSemesterListQuery,
  useGetSemesterQuery,
  useGetActiveSemesterQuery,
  useGetSemesterStatisticsQuery,
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
  useSetActiveSemesterMutation,
} = kurikulumApi;

export default kurikulumApi;