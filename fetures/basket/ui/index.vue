<template>
  <a-badge :count="basketStore.goodsCount" @click="showDrawer">
    <ShoppingFilled class="cart__icon" />
  </a-badge>
  <a-drawer
    v-model:open="visible"
    title="Корзина"
    placement="right"
    :closable="false"
    width="40vw"
    @close="handleClose"
  >
    <a-list bordered>
      <template v-for="item in goodsInfo" :key="item.name">
        <a-list-item>
          <a-list-item-meta>
            <template #avatar>
              <a-avatar
                :src="getDataFromServer(item.main_img)"
                :size="140"
                :alt="item.title"
                class="cart__item__image"
              />
            </template>
            <template #title>
              <CloseCircleFilled
                class="cart__item__close"
                @click="removeItem(item.id)"
              />
              <div class="cart__item__title">
                <span>{{ item.title }}</span>
              </div>
              <section class="cart__item__content">
                <span class="cart__item__price">{{
                  formatPrice(item.price)
                }}</span>
                <div class="cart__item__details">
                  <Counter
                    :count="basketStore.getGood(item.id)"
                    style="width: max-content; box-shadow: none"
                    @update="changeQuantity(item.id, $event)"
                  />
                </div>
              </section>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <template #footer>
      <div class="cart__footer">
        <p class="cart__subtotal">Промежуточный итог: {{ totalPrice }}</p>
        <a-button
          type="primary"
          block
          class="cart__checkout-button"
          @click="checkout"
          >Оплатить</a-button
        >
        <div class="cart__continue-shopping">
          <a @click="handleClose">Продолжить покупки &rarr;</a>
        </div>
      </div>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { getInfoAboutGoods } from "../api";
import Counter from "~/shared/basic/counter/ui/counter.vue";
import { useBasketStore } from "~/entities/basket/modal/basket";
import { getDataFromServer } from "~/shared/utils/urlUtils";

defineOptions({
  name: "BasketPage",
});

const basketStore = useBasketStore();
const goodsInfo = ref([]);

const changeQuantity = (id: number, value: number) => {
  basketStore.changeQuantity(id, value);
};

const visible = ref(false);

const showDrawer = () => {
  visible.value = true;
};

watch(
  () => visible.value,
  async (visible) => {
    if (visible) {
      goodsInfo.value = await getInfoAboutGoods({ id: basketStore.goodsIds });
    }
  },
);

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const handleClose = () => {
  visible.value = false;
};
const checkout = () => {
  console.log("Proceeding to checkout");
};

const totalPrice = ref("2620");

const removeItem = (index) => {
  goodsInfo.value.splice(index, 1);
};
</script>

<style lang="scss">
.cart {
  &__icon {
    font-size: 2.5em;
    color: white;
  }

  &__item {
    &__title {
      font-size: 2em;
      font-weight: 500;
      display: flex;
      flex-direction: column;
      color: #333;
    }

    &__close {
      position: absolute;
      right: 24px;
      font-size: 2em;
      color: #cc3843;
    }

    &__price {
      font-size: 2em;
      color: #007aff;
    }

    &__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__quantity {
      display: flex;
      align-items: center;

      .cart__item__button--minus,
      .cart__item__button--plus {
        margin: 0 0.5rem;
      }
    }

    &__remove {
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }
  }

  &__subtotal {
    font-weight: 600;
    font-size: 2em;
  }

  &__continue-shopping {
    text-align: center;
    margin-top: 1rem;

    a {
      font-size: 0.875rem;
      color: #666;
    }
  }
}
</style>
