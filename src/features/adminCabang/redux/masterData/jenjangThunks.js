import { createAsyncThunk } from '@reduxjs/toolkit';
import { jenjangApi } from '../../api/masterData/jenjangApi';

export const fetchJenjangList = createAsyncThunk(
  'jenjang/fetchList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Gagal memuat data jenjang'
      );
    }
  }
);

export const fetchJenjangDetail = createAsyncThunk(
  'jenjang/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Gagal memuat detail jenjang'
      );
    }
  }
);

export const createJenjang = createAsyncThunk(
  'jenjang/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Gagal menambahkan jenjang'
      );
    }
  }
);

export const updateJenjang = createAsyncThunk(
  'jenjang/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Gagal memperbarui jenjang'
      );
    }
  }
);

export const deleteJenjang = createAsyncThunk(
  'jenjang/delete',
  async (id, { rejectWithValue }) => {
    try {
      await jenjangApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Gagal menghapus jenjang'
      );
    }
  }
);

export const fetchJenjangForDropdown = createAsyncThunk(
  'jenjang/fetchForDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.getForDropdown();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Gagal memuat data dropdown jenjang'
      );
    }
  }
);

export const fetchJenjangStatistics = createAsyncThunk(
  'jenjang/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.getStatistics();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Gagal memuat statistik jenjang'
      );
    }
  }
);