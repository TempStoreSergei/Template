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

const modelValue = defineModel<Blob | null>("value");

const fileList = ref<UploadFile[]>([]);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");

const stop = watch(modelValue, (avatarBlob) => {
  if (avatarBlob && !fileList.value.length) {
    fileList.value = [
      {
        uid: `vc-upload-${Date.now()}-1`,
        name: "Avatar",
        url: avatarBlob,
        status: "done",
      },
    ];
    stop();
  }
});

const isImage = (url: string) => {
  return url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg");
};

const isVideo = (url: string) => {
  return url.endsWith(".mp4");
};

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
  // Read the file as a Blob and store it directly in modelValue
  const reader = new FileReader();
  reader.onload = () => {
    modelValue.value = new Blob([reader.result as ArrayBuffer], {
      type: file.type,
    });
  };
  reader.readAsArrayBuffer(file);
};

const customRequest: UploadProps["customRequest"] = async (options) => {
  await uploadAvatar(options.file as FileType);
};

const handleChange: UploadProps["onChange"] = ({ file }) => {
  console.log("onChange", file);
  file.status = "done";
  fileList.value = [file];
};

const handleRemove: UploadProps["onRemove"] = (file) => {
  console.log("handleRemove", file);
  modelValue.value = null;
  fileList.value = [];
};

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};

const handlePreview = async (file: UploadFile) => {
  if (modelValue.value) {
    // Create a temporary URL for the Blob only for preview purposes
    previewImage.value = modelValue.value;
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
      <div style="margin-top: 8px">Upload</div>
    </div>
  </Upload>
  <a-modal
    :open="previewVisible"
    :title="previewTitle"
    :footer="null"
    @cancel="handleCancel"
  >
    <template v-if="isImage(fileList[0].url)">
      <img alt="example" style="width: 100%" :src="fileList[0].url" />
    </template>
    <template v-else-if="isVideo(fileList[0].url)">
      <video style="width: 100%" controls autoplay>
        <source :src="fileList[0].url" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </template>
  </a-modal>
</template>

<style lang="less" scoped></style>
