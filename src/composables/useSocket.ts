import { ref, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export interface ActiveUser {
  socketId: string;
  userId: string;
  username: string;
  color: string;
  cursor?: { x: number; y: number };
}

export function useSocket() {
  const socket = ref<Socket | null>(null);
  const connected = ref(false);
  const activeUsers = ref<ActiveUser[]>([]);
  const remoteCursors = ref<Map<string, { x: number; y: number; username: string; color: string }>>(new Map());

  const connect = () => {
    if (!socket.value) {
      socket.value = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socket.value.on('connect', () => {
        connected.value = true;
        console.log('Socket connected');
      });

      socket.value.on('disconnect', () => {
        connected.value = false;
        console.log('Socket disconnected');
      });

      socket.value.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
    }
  };

  const joinProject = (projectId: string, userId: string, username: string) => {
    if (socket.value) {
      socket.value.emit('join-project', { projectId, userId, username });
    }
  };

  const leaveProject = (projectId: string) => {
    if (socket.value) {
      socket.value.emit('leave-project', { projectId });
    }
  };

  const emitDraw = (projectId: string, drawData: any) => {
    if (socket.value) {
      socket.value.emit('draw', { projectId, drawData });
    }
  };

  const emitCursorMove = (projectId: string, x: number, y: number) => {
    if (socket.value) {
      socket.value.emit('cursor-move', { projectId, x, y });
    }
  };

  const emitLayerChange = (projectId: string, layers: any[]) => {
    if (socket.value) {
      socket.value.emit('layer-change', { projectId, layers });
    }
  };

  const emitUndo = (projectId: string) => {
    if (socket.value) {
      socket.value.emit('undo', { projectId });
    }
  };

  const emitRedo = (projectId: string) => {
    if (socket.value) {
      socket.value.emit('redo', { projectId });
    }
  };

  const emitClearCanvas = (projectId: string) => {
    if (socket.value) {
      socket.value.emit('clear-canvas', { projectId });
    }
  };

  const emitToolChange = (projectId: string, tool: string) => {
    if (socket.value) {
      socket.value.emit('tool-change', { projectId, tool });
    }
  };

  const emitCanvasUpdate = (projectId: string, canvasData: string, layers: any[]) => {
    if (socket.value) {
      socket.value.emit('canvas-update', { projectId, canvasData, layers });
    }
  };

  const onDraw = (callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on('draw', callback);
    }
  };

  const onSyncState = (callback: (data: { canvasData: string; layers: any[]; version: number }) => void) => {
    if (socket.value) {
      socket.value.on('sync-state', callback);
    }
  };

  const onCursorUpdate = (callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on('cursor-update', (data) => {
        remoteCursors.value.set(data.socketId, {
          x: data.x,
          y: data.y,
          username: data.username,
          color: data.color
        });
        callback(data);
      });
    }
  };

  const onUserJoined = (callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on('user-joined', (data) => {
        activeUsers.value = data.activeUsers;
        callback(data);
      });
    }
  };

  const onUserLeft = (callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on('user-left', (data) => {
        activeUsers.value = activeUsers.value.filter(u => u.socketId !== data.socketId);
        remoteCursors.value.delete(data.socketId);
        callback(data);
      });
    }
  };

  const onLayerUpdate = (callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on('layer-update', callback);
    }
  };

  const onUndo = (callback: () => void) => {
    if (socket.value) {
      socket.value.on('undo', callback);
    }
  };

  const onRedo = (callback: () => void) => {
    if (socket.value) {
      socket.value.on('redo', callback);
    }
  };

  const onClearCanvas = (callback: () => void) => {
    if (socket.value) {
      socket.value.on('clear-canvas', callback);
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    socket,
    connected,
    activeUsers,
    remoteCursors,
    connect,
    disconnect,
    joinProject,
    leaveProject,
    emitDraw,
    emitCursorMove,
    emitLayerChange,
    emitUndo,
    emitRedo,
    emitClearCanvas,
    emitToolChange,
    emitCanvasUpdate,
    onDraw,
    onSyncState,
    onCursorUpdate,
    onUserJoined,
    onUserLeft,
    onLayerUpdate,
    onUndo,
    onRedo,
    onClearCanvas
  };
}
