<template>
    <article
      class="ios-select__select-wrap"
      v-if="props.data.source.length"
      ref="selectWrapRef"
      @touchstart.prevent="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
      @touchend.prevent="handleTouchEnd"
    >
      <ul
        class="ios-select__select-options"
        :style="`transform: translate3d(0, 0, ${-radius}px) rotateX(${itemAngle * store.scroll}deg);`"
      >
        <li
          v-for="(item, index) in props.data.source"
          :key="index"
          class="ios-select__select-option"
          :style="`top: ${itemHeight * -0.5}px;
                  height: ${itemHeight}px;
                  line-height: ${itemHeight}px;
                  transform: rotateX(${-itemAngle * index}deg) translate3d(0, 0, ${radius}px);`"
          :data-index="index"
          v-show="isWithinRange(index)"
        >
          {{ item.text }}
        </li>
      </ul>
      <div
        class="ios-select__highlight"
        :style="`height: 45px;
                   line-height: 45px;`"
      >
        <ul
          class="ios-select__highlight-list"
          :style="`top: -${itemHeight}px; transform: translate3d(0, ${-store.scroll * itemHeight}px, 0);`"
        >
          <li
            class="ios-select__highlight-item"
            :style="`height: ${itemHeight}px`"
          >
            {{ props.data.source[props.data.source.length - 1].text }}
          </li>
          <li
            v-for="(item, index) in props.data.source"
            :key="index"
            class="ios-select__highlight-item"
            :style="`height: ${itemHeight}px;`"
          >
            {{ item.text }}
          </li>
          <li
            class="ios-select__highlight-item"
            :style="`height: ${itemHeight}px;`"
          >
            {{ props.data.source[0].text }}
          </li>
        </ul>
      </div>
    </article>
  </template>
  
  <script setup lang="ts">
  import type { IIosSelect } from './../index'
  
  const easing = {
    easeOutCubic: (pos) => Math.pow(pos - 1, 3) + 1,
    easeOutQuart: (pos) => -(Math.pow(pos - 1, 4) - 1),
  };
  
  const selectWrapRef = ref<HTMLElement | null>(null)
  
  const emit = defineEmits(['onChange'])
  
  const props = defineProps<{
    data: IIosSelect
  }>()
  
  
  const itemHeight = 900 / props.data.count;
  const itemAngle = 360 / props.data.count;
  const radius = itemHeight / Math.tan((itemAngle * Math.PI) / 180);
  const a = props.data.sensitivity * 10;
  const quarterCount = props.data.count / 4;
  
  const store = reactive({
    selected: null,
    moveT: 0,
    touchData: {
      startY: 0,
      yArr: [],
      touchScroll: 0,
    },
    moving: false,
    scroll: 0,
  });
  const isWithinRange = (index) => {
    const sourceLength = props.data.source.length;
    const distanceToScroll = Math.abs(index - store.scroll);
    const distanceToScrollEnd = Math.abs(index - store.scroll - sourceLength);
    const distanceToScrollBeginning = Math.abs(index - store.scroll + sourceLength);
  
    return (
      distanceToScroll < quarterCount ||
      distanceToScrollEnd < quarterCount ||
      distanceToScrollBeginning < quarterCount
    );
  };
  const handleTouchStart = (e) => {
    const eventY = e.clientY || e.touches[0].clientY;
    store.touchData.startY = eventY;
    store.touchData.yArr = [[eventY, new Date().getTime()]];
    store.touchData.touchScroll = store.scroll;
    stop();
  };
  const handleTouchMove = (e) => {
    const eventY = e.clientY || e.touches[0].clientY;
    store.touchData.yArr.push([eventY, new Date().getTime()]);
    const scrollAdd = (store.touchData.startY - eventY) / (itemHeight * 20);
    const moveToScroll = scrollAdd + store.scroll;
    store.scroll = normalizeScroll(moveToScroll);
    store.touchData.touchScroll = normalizeScroll(moveToScroll);
  };
  const handleTouchEnd = () => {
    let v = 0;
  
    if (store.touchData.yArr.length > 1) {
      const [prevY, prevTime] = store.touchData.yArr[store.touchData.yArr.length - 2];
      const [currentY, currentTime] = store.touchData.yArr[store.touchData.yArr.length - 1];
  
      const deltaY = currentY - prevY;
      const deltaTime = currentTime - prevTime;
  
      v = (deltaY / itemHeight) * 1000 / deltaTime;
      v = Math.min(Math.abs(v), 30) * Math.sign(v); // Ensure v is within the range [-30, 30]
    }
    store.scroll = store.touchData.touchScroll;
    animateMoveByInitV(-v)
  };
  const normalizeScroll = (scroll) => {
    let normalizedScroll = scroll;
  
    while (normalizedScroll < 0) {
      normalizedScroll += props.data.source.length;
    }
    normalizedScroll = normalizedScroll % props.data.source.length;
    const isLimit = props.data.minScrollValue && props.data.maxScrollValue
    return isLimit
      ? Math.min(Math.max(normalizedScroll, props.data.minScrollValue), props.data.maxScrollValue)
      : normalizedScroll
  };
  const animateMoveByInitV = async (initV) => {
    const acceleration = initV > 0 ? -a : a; // Deceleration or acceleration
    const time = Math.abs(initV / acceleration); // Time to reduce speed to 0
    const totalScrollLen = initV * time + (acceleration * time * time) / 2; // Total scrolling distance
    const finalScroll = Math.round(store.scroll + totalScrollLen); // Round to ensure final scroll is an integer
  
    await animateToScroll(store.scroll, finalScroll, time, 'easeOutQuart');
    selectByScroll(store.scroll);
  };
  const animateToScroll = (initScroll, finalScroll, time, easingName = "easeOutQuart") => {
    if (initScroll === finalScroll || time === 0) {
      return;
    }
  
    const startTime = new Date().getTime() / 1000;
    let pass = 0;
    const totalScrollLen = finalScroll - initScroll;
  
    return new Promise((resolve) => {
      store.moving = true;
      const tick = () => {
        pass = new Date().getTime() / 1000 - startTime;
        if (pass < time) {
          const progress = pass / time;
          store.scroll = normalizeScroll(initScroll + easing[easingName](progress) * totalScrollLen);
          store.moveT = requestAnimationFrame(tick);
        } else {
          resolve();
          stop();
          store.scroll = normalizeScroll(initScroll + totalScrollLen);
        }
      };
      tick();
    });
  };
  const stop = () => {
    store.moving = false
    cancelAnimationFrame(store.moveT);
  };
  const selectByScroll = (scroll) => {
    store.selected = props.data.source[scroll];
    emit('onChange', store.selected.value)
  };
  const select = (value) => {
    if (!value) {
      return
    }
    for (let i = 0; i < props.data.source.length; i++) {
      if (props.data.source[i].value === value) {
        cancelAnimationFrame(store.moveT);
        const initScroll = normalizeScroll(store.scroll);
        const finalScroll = i;
        const time = Math.sqrt(Math.abs((finalScroll - initScroll) / a));
        animateToScroll(initScroll, finalScroll, time);
        selectByScroll(i);
        return;
      }
    }
    throw new Error(
      `can not select value: ${value}, ${value} match nothing in current props.data.source`
    );
  };
  
  onMounted(() => select(props.data.value))
  </script>
  
  <style lang="scss">
    @import "style.module";
  </style>