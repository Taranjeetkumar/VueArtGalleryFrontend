import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const useProjectStore = defineStore('project', () => {
  const projects = ref<any[]>([]);
  const currentProject = ref<any>(null);
  const myProjects = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProjects = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/projects`, { params });
      projects.value = response.data.projects;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch projects';
    } finally {
      loading.value = false;
    }
  };

  const fetchMyProjects = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/projects/my-projects`);
      myProjects.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch your projects';
    } finally {
      loading.value = false;
    }
  };

  const fetchProject = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      currentProject.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch project';
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/projects`, data);
      myProjects.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create project';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateProject = async (id: string, data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}/projects/${id}`, data);
      currentProject.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update project';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`${API_URL}/projects/${id}`);
      myProjects.value = myProjects.value.filter(p => p._id !== id);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete project';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const createVersion = async (id: string, data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/projects/${id}/versions`, data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create version';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const forkProject = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/projects/${id}/fork`);
      myProjects.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fork project';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const voteProject = async (id: string, value: number) => {
    try {
      const response = await axios.post(`${API_URL}/projects/${id}/vote`, { value });
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to vote';
      return null;
    }
  };

  const addCollaborator = async (id: string, userId: string, role: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/projects/${id}/collaborators`, { userId, role });
      currentProject.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add collaborator';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const removeCollaborator = async (id: string, userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.delete(`${API_URL}/projects/${id}/collaborators`, {
        data: { userId }
      });
      currentProject.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove collaborator';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateCollaboratorRole = async (id: string, userId: string, role: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}/projects/${id}/collaborators/role`, {
        userId,
        role
      });
      currentProject.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update role';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const generateShareLink = async (id: string, role: string, expiresIn?: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/projects/${id}/share-link`, {
        role,
        expiresIn
      });
      return {
        link: response.data.shareUrl,
        ...response.data
      };
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate share link';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const joinViaShareLink = async (id: string, token: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/projects/${id}/join/${token}`);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to join project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    projects,
    currentProject,
    myProjects,
    loading,
    error,
    fetchProjects,
    fetchMyProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    createVersion,
    forkProject,
    voteProject,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorRole,
    generateShareLink,
    joinViaShareLink
  };
});
