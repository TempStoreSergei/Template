<script setup lang="ts">
import { ref, watch } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { message, Upload } from "ant-design-vue";
import type { UploadFile, UploadProps } from "ant-design-vue";

defineOptions({
  name: "AvatarUpload",
  inheritAttrs: false,
});

type FileType = Parameters<NonNullable<UploadProps["beforeUpload"]>>[0];

const modelValue = defineModel<File | null>("value"); // Store the file as File object

const fileList = ref<UploadFile[]>([]);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");

// Watch for modelValue changes and populate the fileList
const stop = watch(modelValue, (avatarFile) => {
  if (avatarFile && !fileList.value.length) {
    fileList.value = [
      {
        uid: `vc-upload-${Date.now()}-1`,
        name: avatarFile.name || "Avatar",
        status: "done",
        url: isHttpUrl(avatarFile)
          ? avatarFile
          : URL.createObjectURL(avatarFile), // Create URL for file preview
      },
    ];
    stop();
  }
});

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }

  return isJpgOrPng && isLt2M;
};

const uploadAvatar = async (file: FileType) => {
  // Directly store the File object in modelValue
  modelValue.value = file;
};

const customRequest: UploadProps["customRequest"] = async (options) => {
  await uploadAvatar(options.file as FileType);
};

const handleChange: UploadProps["onChange"] = ({ file }) => {
  file.status = "done";
  fileList.value = [file];
};

const handleRemove: UploadProps["onRemove"] = (file) => {
  modelValue.value = null;
  fileList.value = [];
};

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};

const handlePreview = async (file: UploadFile) => {
  if (modelValue.value) {
    previewImage.value = file.url || URL.createObjectURL(modelValue.value); // Use file URL for preview
    previewVisible.value = true;
    previewTitle.value = file.name || "Avatar Preview";
  }
};
</script>

<template>
  <Upload
    :file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="min-h-[110px]"
    :custom-request="customRequest"
    @before-upload="beforeUpload"
    @change="handleChange"
    @remove="handleRemove"
    @preview="handlePreview"
  >
    <div v-if="fileList.length < 1">
      <PlusOutlined />
      <div style="margin-top: 8px; font-size: 18px !important">Добавить</div>
    </div>
  </Upload>
  <a-modal
    :open="previewVisible"
    :title="previewTitle"
    :footer="null"
    @cancel="handleCancel"
  >
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<style lang="less" scoped></style>
