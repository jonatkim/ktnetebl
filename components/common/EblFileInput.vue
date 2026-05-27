<template>
  <div class="ebl-file-input">
    <div
      class="ebl-file-input__dropzone"
      :class="{
        'ebl-file-input__dropzone--dragging': isDragging,
        'ebl-file-input__dropzone--disabled': disabled,
      }"
      @dragover.prevent="handleDragOver"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <p class="ebl-file-input__title">{{ placeholder }}</p>
      <p class="ebl-file-input__help">{{ helpText }}</p>
      <EblBtn outlined prepend-icon="ebli:upload" :disabled="disabled" @click="triggerFileInput">
        Upload
      </EblBtn>
      <input
        ref="fileInput"
        type="file"
        class="ebl-file-input__input"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="handleFileSelect"
      />
    </div>

    <!-- File List -->
    <div v-if="uploadedFiles.length > 0" class="ebl-file-input__list">
      <div v-for="file in uploadedFiles" :key="file._id" class="ebl-file-input__item">
        <!-- Thumbnail (for image files) -->
        <div v-if="filePreviews[file._id]" class="ebl-file-input__item-thumbnail">
          <img :src="filePreviews[file._id]" :alt="file.name" />
        </div>

        <!-- File Info -->
        <div class="ebl-file-input__item-info">
          <span class="ebl-file-input__item-name">{{ file.name }}</span>
          <span class="ebl-file-input__item-size">{{ formatFileSize(file.size) }}</span>
        </div>

        <!-- Delete Button -->
        <EblBtn icon small color="ghost" :disabled="disabled" @click="removeFile(file._id)">
          <VIcon size="16">ebli:trash-can</VIcon>
        </EblBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: '*',
  },
  placeholder: {
    type: String,
    default: 'Click here to upload your file or drag.',
  },
  helpText: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const uploadedFiles = ref([])
const filePreviews = ref({}) // Store previews for image files
const isDragging = ref(false) // Track drag state

// Watch modelValue to sync internal state
watch(
  () => props.modelValue,
  (newVal) => {
    uploadedFiles.value = (newVal || []).map((file) => {
      // 기존 파일이면 _id 유지, 새 파일이면 ID 생성
      if (!file._id) {
        file._id = Math.random().toString(36).substring(2, 11)
      }
      return file
    })
    // Generate previews for image files
    uploadedFiles.value.forEach((file) => {
      if (file.type.startsWith('image/') && !filePreviews.value[file._id]) {
        generatePreview(file)
      }
    })
  },
  { immediate: true },
)

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB'
  const kb = Math.round(bytes / 1024)
  return `${kb} KB`
}

// Generate preview for image files
const generatePreview = (file) => {
  if (!file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = (e) => {
    filePreviews.value[file._id] = e.target?.result
  }
  reader.readAsDataURL(file)
}

// Trigger file input
const triggerFileInput = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

// Handle file select
const handleFileSelect = (event) => {
  if (props.disabled) return
  const files = Array.from(event.target.files || [])
  addFiles(files)
}

// Handle drop
const handleDrop = (event) => {
  if (props.disabled) return
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files || [])
  addFiles(files)
}

// Handle drag over
const handleDragOver = (event) => {
  if (props.disabled) return
  event.preventDefault()
}

// Handle drag enter
const handleDragEnter = (event) => {
  if (props.disabled) return
  isDragging.value = true
}

// Handle drag leave
const handleDragLeave = (event) => {
  if (props.disabled) return
  // Only set to false if leaving the dropzone entirely
  if (event.currentTarget === event.target) {
    isDragging.value = false
  }
}

// Add files
const addFiles = (files) => {
  // 파일에 고유 ID 부여
  const newFiles = files.map((file) => {
    file._id = Math.random().toString(36).substring(2, 11)
    return file
  })

  if (!props.multiple && uploadedFiles.value.length > 0) {
    // Replace if single file mode
    uploadedFiles.value = newFiles
    filePreviews.value = {}
  } else if (props.multiple) {
    uploadedFiles.value = [...uploadedFiles.value, ...newFiles]
  } else {
    uploadedFiles.value = newFiles
    filePreviews.value = {}
  }

  // Generate previews for new image files
  uploadedFiles.value.forEach((file) => {
    if (file.type.startsWith('image/') && !filePreviews.value[file._id]) {
      generatePreview(file)
    }
  })

  emit('update:modelValue', uploadedFiles.value)

  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Remove file
const removeFile = (fileId) => {
  if (props.disabled) return
  const index = uploadedFiles.value.findIndex((file) => file._id === fileId)
  if (index > -1) {
    uploadedFiles.value.splice(index, 1)
    delete filePreviews.value[fileId]
    emit('update:modelValue', uploadedFiles.value)
  }
}
</script>
