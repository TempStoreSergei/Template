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

const modelValue = defineModel<Blob[]>("value");

const fileList = ref<UploadFile[]>([]);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");

watch(modelValue, (avatarBlobs) => {
  if (avatarBlobs) {
    fileList.value = avatarBlobs.map((blob) => ({
      uid: blob?.uid || generateUID(), // Retain existing UID or generate if not present
      name: blob?.name || `Avatar ${fileList.value.length + 1}`,
      url: isHttpUrl(blob?.value)
        ? blob.value
        : URL.createObjectURL(blob.value),
      status: "done",
    }));
  }
});

const generateUID = () => {
  return `vc-upload-${Math.random().toString(36).substr(2, 9)}`;
};

const beforeUpload = (file: FileType) => {
  console.log("beforeUpload", file);
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
  try {
    const existingFiles = modelValue.value || [];

    // Create a promise that resolves when the file reading is complete
    const fileReadPromise = new Promise<Blob>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const blob = new Blob([reader.result as ArrayBuffer], {
          type: file.type,
        });
        resolve(blob);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read the file"));
      };

      reader.readAsArrayBuffer(file);
    });

    // Await the file reading result
    const blob = await fileReadPromise;
    // Update modelValue with the new file
    modelValue.value = [
      ...existingFiles,
      {
        value: blob,
        uid: generateUID(),
      },
    ];
  } catch (error) {
    console.error("Error uploading avatar:", error);
  }
};

const customRequest: UploadProps["customRequest"] = async (options) => {
  await uploadAvatar(options.file as FileType);
};

const handleChange: UploadProps["onChange"] = ({
  file,
  fileList: newFileList,
}) => {
  if (file.status === "done") {
    fileList.value = newFileList;
  }
};

const handleRemove: UploadProps["onRemove"] = (file) => {
  try {
    const { uid } = file;

    // Ensure modelValue is always initialized
    modelValue.value = modelValue.value.filter((blob) => blob.uid !== uid);

    // Update the file list by removing the file with the same uid
    fileList.value = fileList.value.filter((f) => f.uid !== uid);
  } catch (error) {
    console.error("Error removing file:", error);
  }
};

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};

const handlePreview = async (file: UploadFile) => {
  previewImage.value = file.url || "";
  previewVisible.value = true;
  previewTitle.value = file.name || "Image Preview";
};
</script>

<template>
  <Upload
    :file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="min-h-[110px]"
    :custom-request="customRequest"
    :max-count="2"
    multiple
    @before-upload="beforeUpload"
    @change="handleChange"
    @remove="handleRemove"
    @preview="handlePreview"
  >
    <div>
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
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>
