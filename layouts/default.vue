<template>
  <a-layout>
    <a-modal
      v-model:open="goodStore.isVisible"
      :ok-text="`В корзину за ${goodStore.getInfo.price}`"
      cancel-text="Отмена"
      :title="goodStore.getInfo.title"
      :closable="false"
      width="min-content"
      @ok="() => {}"
    >
      <main class="column">
        <div v-if="goodStore.getInfo.is_active_addit_img" class="test">
          <swiper
            :spaceBetween="32"
            :slidesPerView="4"
            :freeMode="true"
            :watchSlidesProgress="true"
            class="clear-margin"
            direction="vertical"
            style="height: 40vh"
            @swiper="setThumbsSwiper"
          >
            <swiper-slide
              v-for="(image, index) in images"
              :key="'thumb-' + index"
            >
              <div class="good-image">
                <img
                  :src="image"
                  style="height: 100%; width: 100%; object-fit: cover"
                  alt="Nature image"
                />
              </div>
            </swiper-slide>
          </swiper>
          <swiper
            :spaceBetween="10"
            :navigation="false"
            :thumbs="{ swiper: thumbsSwiper }"
            :modules="[FreeMode, Thumbs]"
            class="clear-margin"
            style="height: 40vh; aspect-ratio: 1.618 / 1"
          >
            <swiper-slide
              v-for="(image, index) in images"
              :key="'main-' + index"
            >
              <div class="good-image-main">
                <img
                  :src="image"
                  style="height: 100%; width: 100%; object-fit: cover"
                  alt="Nature image"
                />
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <a-descriptions layout="vertical" bordered style="min-width: 320px">
          <a-descriptions-item label="Описание">
            <span v-if="goodStore.getInfo.description">
              {{ goodStore.getInfo.description }}
            </span>
            <span v-else> Для этого товара еще не добавили описание </span>
          </a-descriptions-item>
        </a-descriptions>
      </main>
    </a-modal>
    <aside class="navigation-main">
      <a-tabs
        v-model:activeKey="activeKey"
        centered
        style="height: 100%"
        tab-position="left"
        size="large"
        @change="tabs.setActiveIndex($event)"
      >
        <a-tab-pane v-for="tab in elements" :key="tab.value" :tab="tab.title" />
      </a-tabs>
    </aside>
    <a-layout>
      <Navigation />
      <a-layout-content>
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { FreeMode, Thumbs } from "swiper/modules";
import Navigation from "~/widgets/navigation/ui";
import { useGoodStore } from "~/entities/description/modal/good";
import { useTabsStore } from "~/entities/navigation/modal/tabs";
const tabs = useTabsStore();

const callback = (val) => {
  console.log(val);
};

const elements = computed(() => tabs.getAllTabs());
const activeKey = computed(() => tabs.getActiveTab());

const goodStore = useGoodStore();

// Define the array of image URLs
const images = [
  "https://swiperjs.com/demos/images/nature-1.jpg",
  "https://swiperjs.com/demos/images/nature-2.jpg",
  "https://swiperjs.com/demos/images/nature-3.jpg",
  "https://swiperjs.com/demos/images/nature-4.jpg",
  "https://swiperjs.com/demos/images/nature-5.jpg",
  "https://swiperjs.com/demos/images/nature-6.jpg",
  "https://swiperjs.com/demos/images/nature-7.jpg",
  "https://swiperjs.com/demos/images/nature-8.jpg",
  "https://swiperjs.com/demos/images/nature-10.jpg",
];

const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};
</script>

<style lang="scss">
.ant-tabs-content-holder {
  display: none !important;
}

.ant-tabs-tab-btn {
  font-size: 1.5em;
}
.good-image {
  height: 10vh;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 1.618/1;
}

.good-image-main {
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 1.618/1;
}

.navigation-main {
  z-index: 20;
  height: calc(100vh - 64px);
  bottom: 0;
  position: absolute !important;
  background-color: rgba(255, 255, 255, 0.1) !important; // Frosted glass effect with transparency
  backdrop-filter: saturate(180%) blur(20px); // Higher saturation and blur
  -webkit-backdrop-filter: saturate(180%) blur(20px); // For Safari support
  border-right: 1px solid rgba(255, 255, 255, 0.3); // Optional light border
}

.test {
  display: flex;
  gap: 24px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.clear-margin {
  margin: 0;
}
</style>
