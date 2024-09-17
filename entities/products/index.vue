<template>
  <a-badge-ribbon class="card-good__ribbon" :text="title">
    <div class="card-good">
      <img
        ref="productImage"
        class="card-good__image"
        alt="example"
        :src="image"
      />

      <InfoCircleFilled class="card-good__action card-good__action-info" />
      <!-- Counter appears after animation -->

      <!-- Counter with transition -->
      <transition name="fade">
        <Counter
          v-if="addedToCart"
          :count="basketStore.getGood(goodId)"
          class="card-good__action card-good__counter"
          @update="changeQuantity"
          @delete="removeFromBasket"
        />
      </transition>

      <!-- Button with transition -->
      <transition name="fade">
        <a-button
          v-if="!addedToCart"
          class="card-good__action card-good__action-basket"
          type="dashed"
          size="large"
          @click="addToCart"
        >
          <span>
            В корзину за
            <span class="card-good__price">
              {{ formatPrice }}
            </span>
          </span>
        </a-button>
      </transition>
    </div>
  </a-badge-ribbon>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { InfoCircleFilled } from "@ant-design/icons-vue";
import { useBasketStore } from "~/entities/basket/modal/basket";
import Counter from "~/shared/basic/counter/ui/counter.vue";

const props = defineProps({
  image: {
    type: String,
    default:
      "http://res.cloudinary.com/prvnbist/image/upload/v1508603573/helmet.png",
  },
  imageAlt: {
    type: String,
    default: "Product Image",
  },
  title: {
    type: String,
    default: "Product Image",
  },
  price: {
    type: Number,
    default: 1299.99, // Make sure this is a number for calculations
  },
  goodId: {
    type: Number,
  },
});

const basketStore = useBasketStore();

const formatPrice = computed(() =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.price),
);

const addedToCart = ref(false);
const quantity = ref(1);

const addToCart = () => {
  basketStore.addGood(props.goodId);
  addedToCart.value = true; // Set added to cart status
};

const removeFromBasket = () => {
  addedToCart.value = false; // Se
  quantity.value = 1;
};

const changeQuantity = (value: number) => {
  basketStore.changeQuantity(props.goodId, value);
};
</script>

<style lang="scss">
.card-good {
  width: 35vw;
  border-radius: 24px;
  aspect-ratio: 1.618 / 1;
  overflow: hidden;
  position: relative;

  &__ribbon {
    padding: 8px;
    font-size: 2em;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease-out;
  }

  &__price {
    color: #007aff;
  }

  &__action {
    position: absolute;

    &-basket {
      font-size: 2em !important;
      height: auto !important;
      bottom: 10px;
      right: 20px;
    }

    &-info {
      top: 10px;
      color: white;
      font-size: 4em;
      left: 20px;
    }
  }

  &__counter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 10px;
    right: 20px;

    &-quantity {
      font-size: 1.5em;
      margin: 0 10px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s,
    transform 0.5s;
}

.fade-enter {
  opacity: 0;
  transform: scale3d(0.3, 0.3, 0.3);
}

.fade-enter-to {
  opacity: 1;
  transform: scale3d(1, 1, 1); // End state after enter transition
}

.fade-leave {
  opacity: 1;
  transform: scale3d(1, 1, 1); // Start state before leave transition
}

.fade-leave-to {
  opacity: 0;
  transform: scale3d(0.3, 0.3, 0.3); // End state for leave transition
}
</style>
