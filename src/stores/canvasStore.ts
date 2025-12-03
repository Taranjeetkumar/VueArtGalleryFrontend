import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Layer {
  id: string;
  name: string;
  data: string;
  visible: boolean;
  opacity: number;
}

export interface DrawingState {
  tool: 'brush' | 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'fill';
  color: string;
  strokeWidth: number;
  opacity: number;
}

export const useCanvasStore = defineStore('canvas', () => {
  const layers = ref<Layer[]>([
    {
      id: 'layer-1',
      name: 'Layer 1',
      data: '',
      visible: true,
      opacity: 1
    }
  ]);

  const currentLayerIndex = ref(0);
  const drawingState = ref<DrawingState>({
    tool: 'brush',
    color: '#000000',
    strokeWidth: 5,
    opacity: 1
  });

  const history = ref<any[]>([]);
  const historyIndex = ref(-1);
  const maxHistory = 50;

  const canvasSize = ref({ width: 1200, height: 800 });
  const backgroundColor = ref('#ffffff');
  const zoom = ref(1);

  const currentLayer = computed(() => layers.value[currentLayerIndex.value]);

  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  const setTool = (tool: DrawingState['tool']) => {
    drawingState.value.tool = tool;
  };

  const setColor = (color: string) => {
    drawingState.value.color = color;
  };

  const setStrokeWidth = (width: number) => {
    drawingState.value.strokeWidth = width;
  };

  const setOpacity = (opacity: number) => {
    drawingState.value.opacity = opacity;
  };

  const addLayer = (name?: string) => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: name || `Layer ${layers.value.length + 1}`,
      data: '',
      visible: true,
      opacity: 1
    };
    layers.value.push(newLayer);
    currentLayerIndex.value = layers.value.length - 1;
  };

  const deleteLayer = (index: number) => {
    if (layers.value.length > 1) {
      layers.value.splice(index, 1);
      if (currentLayerIndex.value >= layers.value.length) {
        currentLayerIndex.value = layers.value.length - 1;
      }
    }
  };

  const selectLayer = (index: number) => {
    currentLayerIndex.value = index;
  };

  const toggleLayerVisibility = (index: number) => {
    layers.value[index].visible = !layers.value[index].visible;
  };

  const setLayerOpacity = (index: number, opacity: number) => {
    layers.value[index].opacity = opacity;
  };

  const renameLayer = (index: number, name: string) => {
    layers.value[index].name = name;
  };

  const reorderLayers = (fromIndex: number, toIndex: number) => {
    const [removed] = layers.value.splice(fromIndex, 1);
    layers.value.splice(toIndex, 0, removed);
  };

  const saveState = (canvasData: string) => {
    // Remove any states after current index
    history.value = history.value.slice(0, historyIndex.value + 1);

    // Add new state
    history.value.push({
      layers: JSON.parse(JSON.stringify(layers.value)),
      canvasData
    });

    // Limit history size
    if (history.value.length > maxHistory) {
      history.value.shift();
    } else {
      historyIndex.value++;
    }
  };

  const undo = () => {
    if (canUndo.value) {
      historyIndex.value--;
      const state = history.value[historyIndex.value];
      layers.value = JSON.parse(JSON.stringify(state.layers));
      return state.canvasData;
    }
    return null;
  };

  const redo = () => {
    if (canRedo.value) {
      historyIndex.value++;
      const state = history.value[historyIndex.value];
      layers.value = JSON.parse(JSON.stringify(state.layers));
      return state.canvasData;
    }
    return null;
  };

  const clear = () => {
    layers.value = [
      {
        id: 'layer-1',
        name: 'Layer 1',
        data: '',
        visible: true,
        opacity: 1
      }
    ];
    currentLayerIndex.value = 0;
    history.value = [];
    historyIndex.value = -1;
  };

  const setCanvasSize = (width: number, height: number) => {
    canvasSize.value = { width, height };
  };

  const setBackgroundColor = (color: string) => {
    backgroundColor.value = color;
  };

  const setZoom = (value: number) => {
    zoom.value = Math.max(0.1, Math.min(5, value));
  };

  const loadLayers = (loadedLayers: Layer[]) => {
    layers.value = loadedLayers;
    currentLayerIndex.value = 0;
  };

  return {
    layers,
    currentLayerIndex,
    currentLayer,
    drawingState,
    canvasSize,
    backgroundColor,
    zoom,
    canUndo,
    canRedo,
    setTool,
    setColor,
    setStrokeWidth,
    setOpacity,
    addLayer,
    deleteLayer,
    selectLayer,
    toggleLayerVisibility,
    setLayerOpacity,
    renameLayer,
    reorderLayers,
    saveState,
    undo,
    redo,
    clear,
    setCanvasSize,
    setBackgroundColor,
    setZoom,
    loadLayers
  };
});
