<template>
  <section>
    <MdEditor
      v-model="text"
      style="margin-bottom: 24px"
      editor-id="myId"
      language="ru-RU"
      :toolbars="toolbar"
      :noKatex="true"
      :noMermaid="true"
      :showToolbarName="true"
      @on-input="setValueFromKeyboard($event)"
      @on-change="debouncedSave"
    />
    <NuxtLink to="/dishes">
      <a-button type="dashed">Вернуться к блюдам</a-button>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MdEditor, config } from "md-editor-v3";
import { useDebounceFn } from "@vueuse/core";
import { useRoute } from "vue-router";
import { saveRecipe, getRecipe } from "../api";
import "md-editor-v3/lib/style.css";

config({
  editorConfig: {
    languageUserDefined: {
      "ru-RU": {
        toolbarTips: {
          bold: "Жирный",
          underline: "Подчеркнутый",
          italic: "Курсив",
          strikeThrough: "Зачеркнутый",
          title: "Заголовок",
          sub: "Нижний индекс",
          sup: "Верхний индекс",
          quote: "Цитата",
          unorderedList: "Маркированный список",
          orderedList: "Нумерованный список",
          task: "Список задач",
          codeRow: "Встроенный код",
          code: "Блочный код",
          link: "Ссылка",
          image: "Изображение",
          table: "Таблица",
          mermaid: "Mermaid",
          katex: "Формула",
          revoke: "Отменить",
          next: "Вернуть",
          save: "Сохранить",
          prettier: "Форматировать",
          pageFullscreen: "Полноэкранный режим",
          fullscreen: "На весь экран",
          preview: "Предпросмотр",
          previewOnly: "Только предпросмотр",
          htmlPreview: "HTML предпросмотр",
          catalog: "Каталог",
          github: "Исходный код",
        },
        titleItem: {
          h1: "Заголовок 1 уровня",
          h2: "Заголовок 2 уровня",
          h3: "Заголовок 3 уровня",
          h4: "Заголовок 4 уровня",
          h5: "Заголовок 5 уровня",
          h6: "Заголовок 6 уровня",
        },
        imgTitleItem: {
          link: "Добавить ссылку на изображение",
          upload: "Загрузить изображение",
          clip2upload: "Обрезка и загрузка",
        },
        linkModalTips: {
          linkTitle: "Добавить ссылку",
          imageTitle: "Добавить изображение",
          descLabel: "Описание:",
          descLabelPlaceHolder: "Введите описание...",
          urlLabel: "Ссылка:",
          urlLabelPlaceHolder: "Введите ссылку...",
          buttonOK: "ОК",
        },
        clipModalTips: {
          title: "Обрезать изображение",
          buttonUpload: "Загрузить",
        },
        copyCode: {
          text: "Копировать",
          successTips: "Скопировано!",
          failTips: "Ошибка копирования!",
        },
        mermaid: {
          flow: "Блок-схема",
          sequence: "Диаграмма последовательности",
          gantt: "Гант диаграмма",
          class: "Классовая диаграмма",
          state: "Диаграмма состояний",
          pie: "Круговая диаграмма",
          relationship: "Связи",
          journey: "План",
        },
        katex: {
          inline: "Встроенная формула",
          block: "Блочная формула",
        },
        footer: {
          markdownTotal: "Количество символов",
          scrollAuto: "Автопрокрутка",
        },
      },
    },
  },
});

const route = useRoute();
const recipeId = ref<string | null>(null);
const text = ref<string>("");

const setValueFromKeyboard = (inputEvent) => {
  console.log(inputEvent);
  switch (inputEvent.inputType) {
    case "insertText":
      text.value += inputEvent.data;
      break;

    case "deleteContentBackward":
      text.value = text.value.slice(0, -1);
      break;
    default:
      text.value = "";
  }
};

const toolbar = [
  "bold",
  "underline",
  "italic",
  "-",
  "title",
  "strikeThrough",
  "unorderedList",
  "orderedList",
  "-",
  "table",
  "-",
  "revoke",
  "next",
  "=",
  "fullscreen",
  "catalog",
];

const onAutoSave = async () => {
  if (recipeId.value) {
    await saveRecipe(recipeId.value, { dishRecipe: text.value });
  }
};

const debouncedSave = useDebounceFn(onAutoSave, 500);

onMounted(async () => {
  if (route.params.id) {
    recipeId.value = Number(route.params.id);
    text.value = await getRecipe(recipeId.value);
  }
});
</script>
