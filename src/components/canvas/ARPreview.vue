<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
          <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          AR Preview
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- QR Code Section -->
        <div class="space-y-4">
          <div class="bg-slate-900 rounded-lg p-6 flex flex-col items-center">
            <p class="text-slate-300 text-sm mb-4 text-center">
              Scan this QR code with your mobile device to view your artwork in AR
            </p>

            <!-- QR Code Placeholder (in production, use a QR library) -->
            <div class="bg-white p-4 rounded-lg">
              <canvas ref="qrCanvas" width="200" height="200" class=""></canvas>
            </div>

            <p class="text-xs text-slate-500 mt-4 text-center">
              Or visit: <span class="text-cyan-400">{{ arUrl }}</span>
            </p>
          </div>

          <button
            @click="copyLink"
            class="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {{ copied ? 'Copied!' : 'Copy Link' }}
          </button>
        </div>

        <!-- Instructions Section -->
        <div class="space-y-4">
          <div class="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg p-4 border border-purple-500/20">
            <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              How to View in AR
            </h3>
            <ol class="space-y-2 text-sm text-slate-300">
              <li class="flex gap-2">
                <span class="text-cyan-400 font-bold">1.</span>
                <span>Open your phone's camera app</span>
              </li>
              <li class="flex gap-2">
                <span class="text-cyan-400 font-bold">2.</span>
                <span>Point at the QR code above</span>
              </li>
              <li class="flex gap-2">
                <span class="text-cyan-400 font-bold">3.</span>
                <span>Tap the notification to open AR view</span>
              </li>
              <li class="flex gap-2">
                <span class="text-cyan-400 font-bold">4.</span>
                <span>Point your camera at a wall to place your artwork</span>
              </li>
            </ol>
          </div>

          <div class="bg-slate-900 rounded-lg p-4 space-y-2">
            <h3 class="text-white font-semibold mb-2 flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AR Features
            </h3>
            <ul class="space-y-1 text-sm text-slate-300">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Scale artwork to fit any wall
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Rotate and position freely
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Take photos with AR artwork
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Share AR experience
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-4 border-t border-slate-700">
        <button
          @click="downloadQR"
          class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR Code
        </button>
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import QRCode from 'qrcode';
import axios from 'axios';

interface Props {
  show: boolean;
  projectId: string;
  canvasDataUrl?: string;
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
}>();

const qrCanvas = ref<HTMLCanvasElement | null>(null);
const copied = ref(false);
const arUrl = ref('');
const uploading = ref(false);
const uploadError = ref('');

onMounted(() => {
  generateARUrl();
});

watch(() => props.show, async (newVal) => {
  if (newVal) {
    await uploadToS3();
    generateARUrl();
    generateQRCode();
  }
});

const uploadToS3 = async () => {
  uploading.value = true;
  uploadError.value = '';

  try {
    // Get canvas data from parent component
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    const imageData = canvas.toDataURL('image/png');

    // Upload to S3 via backend
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/ar/upload`,
      {
        imageData,
        projectId: props.projectId
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.success) {
      // Use the S3 URL for AR viewing
      arUrl.value = response.data.url;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error: any) {
    console.error('Failed to upload to S3:', error);
    uploadError.value = error.response?.data?.message || 'Failed to upload image for AR preview';
    // Fallback to local URL
    const baseUrl = window.location.origin;
    arUrl.value = `${baseUrl}/ar/${props.projectId}`;
  } finally {
    uploading.value = false;
  }
};

const generateARUrl = () => {
  if (!arUrl.value) {
    const baseUrl = window.location.origin;
    arUrl.value = `${baseUrl}/ar/${props.projectId}`;
  }
};

const generateQRCode = async () => {
  if (!qrCanvas.value) return;

  try {
    await QRCode.toCanvas(qrCanvas.value, arUrl.value, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(arUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const downloadQR = () => {
  if (!qrCanvas.value) return;

  const link = document.createElement('a');
  link.download = 'artwork-ar-qr.png';
  link.href = qrCanvas.value.toDataURL();
  link.click();
};
</script>
