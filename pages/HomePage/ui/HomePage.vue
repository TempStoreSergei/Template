<template>
  <section>
    <swiper
      direction="vertical"
      :slides-per-view="1"
      :space-between="30"
      :mousewheel="mouseWheelSetting"
      :modules="[Mousewheel, Pagination]"
      class="page"
      @swiper="onSwiperInit"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="category in categories" :key="category.categoryId">
        <article class="collage">
          <div class="image-container">
            <div class="image">
              <img
                :src="getDataFromServer(category.categoryIMG)"
                alt="category-image"
              />
              <div class="image-hero">
                <h1 class="image-title">{{ category.categoryName }}</h1>
              </div>
            </div>
            <swiper
              :effect="'coverflow'"
              :grabCursor="true"
              :centeredSlides="true"
              slideActiveClass="active-goods"
              :slidesPerView="'auto'"
              :coverflowEffect="{
                rotate: 20,
                stretch: 25,
                depth: 250,
                modifier: 1,
                slideShadows: false,
              }"
              :pagination="false"
              :modules="[EffectCoverflow]"
              class="horizontal-scroll"
            >
              <swiper-slide
                v-for="good in category.goods"
                :key="good.goodId"
                style="width: max-content; height: 100%"
              >
                <Product
                  :image="getDataFromServer(good.mainImg)"
                  :price="good.goodPrice"
                  :title="good.goodName"
                  :goodId="good.goodId"
                />
              </swiper-slide>
            </swiper>
          </div>
        </article>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Mousewheel, Pagination, EffectCoverflow } from "swiper/modules";
import type { AxiosRequestConfig } from "axios";
import { useTabsStore } from "~/entities/navigation/modal/tabs";
import { getDataFromServer } from "~/shared/utils/urlUtils";

import { request } from "~/shared/api/request";

import Product from "~/entities/products";
import { useGoodStore } from "~/entities/description/modal/good";

const getInfo = (options?: AxiosRequestConfig) => {
  return request({
    url: "/system/get_data",
    method: "GET",
    ...options,
  });
};

const tabs = useTabsStore();
const goodStore = useGoodStore();

const swiperInstance = ref(null);
const activeIndex = ref(0);

// Reactive state for left offset
const categories = ref([]);

const mouseWheelSetting = computed(() => ({
  enabled: true,
  forceToAxis: true,
}));

const onSlideChange = (swiper) => {
  activeIndex.value = swiper.activeIndex;
  tabs.setActiveIndex(swiper.activeIndex);
};

const goToSlide = (index) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index); // Use the stored Swiper instance to navigate to the slide
  }
};

const onSwiperInit = (swiper) => {
  swiperInstance.value = swiper; // Store the Swiper instance when initialized
};

// Watch for activeTab changes and trigger slide navigation
watch(
  () => tabs.getActiveTab(),
  (newIndex) => {
    goToSlide(newIndex);
  },
);

onMounted(async () => {
  categories.value = await getInfo();
  const elements = categories.value.map((category, index) => ({
    value: index,
    title: category.categoryName,
  }));
  tabs.saveTabs(elements);
});
</script>

<style lang="scss">
@import "styles.module";
</style>
