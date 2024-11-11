<template>
  <div class="upload">
    <a-upload-dragger
      v-model:fileList="fileList"
      class="upload__dragger"
      :custom-request="customRequest"
      :headers="uploadHeaders"
      @change="handleChange"
      @drop="handleDrop"
    >
      <inbox-outlined class="upload__icon" />
      <p class="upload__text">
        Щелкните или перетащите файл в эту область для загрузки
      </p>
      <p class="upload__hint">Поддержка одиночной или массовой загрузки.</p>
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
      <NuxtLink to="/generator">
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
import { ref, computed } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { deleteDataBase, updateContent, checkFormat } from "../api";
import type {
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "ant-design-vue";

const customRequest: UploadProps["customRequest"] = async (options) => {
  try {
    await checkFormat({ file: options.file as FileType });
    options.onSuccess && options.onSuccess(null, options.file);
  } catch (error) {
    options.onError && options.onError(error);
  }
};

const loading = ref(false);
const fileList = ref<UploadFile[]>([]);
const isModalVisible = ref(false);

const uploadHeaders = computed(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token not found in localStorage");
  }
  return {
    Authorization: `Bearer ${token || ""}`,
  };
});

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
    updateContent({ file: fileList.value[0].originFileObj });
    message.success(`${name} uploaded successfully.`);
  } else if (status === "error") {
    message.error(`${name} failed to upload.`);
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
