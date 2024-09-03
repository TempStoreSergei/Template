<template>
  <div class="preview-resource">
    <template v-if="isImage">
      <img :src="url" alt="Preview" class="preview-resource__image" />
    </template>
    <template v-else-if="isVideo">
      <video :src="url" controls class="preview-resource__video">
        Your browser does not support the video tag.
      </video>
    </template>
    <template v-else-if="isAudio">
      <audio :src="url" controls class="preview-resource__audio">
        Your browser does not support the audio element.
      </audio>
    </template>
    <template v-else-if="isPdf">
      <iframe :src="url" class="preview-resource__pdf" />
    </template>
    <template v-else>
      <div class="preview-resource__unsupported"> Unsupported file type. </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  defineOptions({
    name: 'PreviewResource',
  });

  const props = defineProps<{
    url: string;
    type: string;
  }>();

  const isImage = computed(() => props.type.startsWith('image/'));
  const isVideo = computed(() => props.type.startsWith('video/'));
  const isAudio = computed(() => props.type.startsWith('audio/'));
  const isPdf = computed(() => props.type === 'application/pdf');
</script>

<style lang="scss">
  .preview-resource {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    &__image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    &__video,
    &__audio {
      width: 100%;
      height: 100%;
    }

    &__pdf {
      width: 100%;
      height: 100%;
      border: none;
    }

    &__unsupported {
      color: #999;
      text-align: center;
      font-size: 1rem;
    }
  }
</style>
