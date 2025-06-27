<template>
  <div class="upload">
    <a-upload-dragger
      v-model:fileList="fileList"
      class="upload__dragger"
      :custom-request="updateContent"
      method="PUT"
      @change="handleChange"
      @drop="handleDrop"
    >
      <inbox-outlined class="upload__icon" />
      <p class="upload__text">
        Щелкните или перетащите файл в эту область для загрузки
      </p>
      <p class="upload__hint">Поддержка одиночной или массовой загрузки.</p>
      <template #itemRender="{ file, actions }">
        <a-space />
      </template>
    </a-upload-dragger>
    <a-divider class="upload__divider" />
    <a-flex gap="large">
      <a-button
        class="upload__clear-button"
        type="dashed"
        danger
        :loading="loading"
        @click="showModal"
      >
        Очистить контент
      </a-button>
      <NuxtLink :to="null" @click.prevent="openAppOnDifferentPort">
        <a-button class="upload__clear-button" type="dashed">
          Сгенерировать установочный файл
        </a-button>
      </NuxtLink>
    </a-flex>

    <!-- Confirmation Modal -->
    <a-modal
      v-model:visible="isModalVisible"
      class="upload__modal"
      title="Подтверждение удаления"
      :okText="'Подтвердить'"
      :cancelText="'Отмена'"
      :confirmLoading="loading"
      @ok="confirmDelete"
      @cancel="handleCancel"
    >
      <p class="upload__modal-text">
        Вы уверены, что хотите очистить контент базы данных?
      </p>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { deleteDataBase, updateContent } from "../api";
import type { UploadChangeParam, UploadFile } from "ant-design-vue";

const openAppOnDifferentPort = () => {
  window.location.href = `http://10.0.0.8:3333/`; // Ensure the correct format with 'http://' and the desired port
};

const loading = ref(false);
const fileList = ref<UploadFile[]>([]);
const isModalVisible = ref(false);

const showModal = () => {
  isModalVisible.value = true;
};

const handleCancel = () => {
  isModalVisible.value = false;
};

const confirmDelete = async () => {
  loading.value = true;
  try {
    await deleteDataBase();
    message.success("Контент успешно очищен.");
  } catch (error) {
    message.error("Ошибка при очистке контента.");
  } finally {
    loading.value = false;
    isModalVisible.value = false;
  }
};

const handleChange = (info: UploadChangeParam) => {
  const { status, name } = info.file;
  if (status === "done") {
    message.success(`Контент успешно загружен на сервер: ${name}.`);
  } else if (status === "error") {
    message.error(`Не удалось загрузить файл: ${name} на сервер.`);
  }
};

const handleDrop = (e: DragEvent) => {
  console.log("File(s) dropped:", e.dataTransfer?.files);
};
</script>

<style lang="scss">
.upload {
  &__icon {
    color: blue;
    svg {
      height: 48px !important;
      width: 48px !important;
    }
  }
}
</style>
