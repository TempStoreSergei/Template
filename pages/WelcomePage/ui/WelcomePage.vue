<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { ref } from "vue";

const swiperRef = ref(null);

const mediaItems = ref([
  {
    type: "image",
    src: "https://jaromvogel.com/images/design/jumping_rabbit/page2layer0.png",
  },
  {
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4", // Example video URL
  },
  {
    type: "image",
    src: "https://jaromvogel.com/images/design/jumping_rabbit/page2layer1.png",
  },
]);

const autoplayMedia = (swiper) => {
  const realIndex = swiper.realIndex; // Get the real index, ignoring loop duplicates
  const currentSlide = swiper.slides[swiper.activeIndex];
  const video = currentSlide.querySelector("video");

  if (video) {
    video.play();
    video.onended = () => {
      swiper.slideNext(); // Move to the next slide once the video ends
    };
  } else {
    setTimeout(() => {
      swiper.slideNext(); // Move to the next slide after 10 seconds (image case)
    }, 2000);
  }
};

const onSwiperInit = (swiper) => {
  autoplayMedia(swiper); // Call autoplay on initialization
  swiper.on("slideChangeTransitionEnd", () => autoplayMedia(swiper)); // Ensure autoplay works on each slide change
};
</script>

<template>
  <div>
    <Swiper
      ref="swiperRef"
      :slides-per-view="1"
      :loop="true"
      :space-between="0"
      :autoplay="false"
      style="height: 100vh; width: 100vw"
      @swiper="onSwiperInit"
    >
      <SwiperSlide v-for="(item, index) in mediaItems" :key="index">
        <template v-if="item.type === 'image'">
          <img
            :src="item.src"
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </template>
        <template v-else-if="item.type === 'video'">
          <video
            :src="item.src"
            style="width: 100%; height: 100%; object-fit: cover"
            muted
          />
        </template>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
