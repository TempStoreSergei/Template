<template>
  <a-badge :count="20" @click="showDrawer">
    <a-avatar shape="square" size="large" />
  </a-badge>
  <Drawer
    v-model:open="visible"
    placement="right"
    :closable="false"
    title="Корзина"
  >
    <a-layout class="shopping-cart">
      <a-row justify="center" class="cart-container">
        <!-- Cart Items Section -->
        <a-col :span="24" class="cart-items">
          <div
            v-for="(item, index) in cartItems"
            :key="index"
            class="cart-item"
          >
            <a-row :gutter="[16, 16]" align="middle">
              <a-col class="cart-image">
                <a-image
                  style="width: 300px; aspect-ratio: 1.618/1"
                  :src="item.image"
                  :alt="item.alt"
                />
              </a-col>

              <a-col flex="1" class="cart-details">
                <a-typography-text class="cart-item-name">{{
                  item.name
                }}</a-typography-text>
                <div class="cart-actions">
                  <a-button
                    type="link"
                    class="add-favorite"
                    @click="addToFavorites(item)"
                  >
                    Add to Favorites
                  </a-button>
                  <a-button
                    type="link"
                    danger
                    class="remove-item"
                    @click="removeItem(index)"
                  >
                    Remove
                  </a-button>
                </div>
              </a-col>

              <a-col class="cart-quantity">
                <a-input-number
                  v-model:value="item.quantity"
                  :min="1"
                  @change="updateQuantity(item)"
                />
              </a-col>

              <a-col class="cart-price">
                <a-typography-text>{{
                  formatCurrency(item.price)
                }}</a-typography-text>
              </a-col>
            </a-row>
          </div>
        </a-col>

        <!-- Order Summary Section -->
        <a-col :span="24" class="order-summary">
          <div class="summary-details">
            <a-typography-title :level="4">Order summary</a-typography-title>
            <a-space direction="vertical" size="small" style="width: 100%">
              <div class="summary-item">
                <span>Original price</span>
                <span>{{ formatCurrency(summary.originalPrice) }}</span>
              </div>
              <div class="summary-item">
                <span>Savings</span>
                <span class="savings">{{
                  formatCurrency(summary.savings)
                }}</span>
              </div>
              <div class="summary-item">
                <span>Store Pickup</span>
                <span>{{ formatCurrency(summary.storePickup) }}</span>
              </div>
              <div class="summary-item">
                <span>Tax</span>
                <span>{{ formatCurrency(summary.tax) }}</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span>{{ formatCurrency(summary.total) }}</span>
              </div>
            </a-space>
            <a-button type="primary" block class="checkout-btn">
              Proceed to Checkout
            </a-button>
            <div class="continue-shopping">
              <span>or</span>
              <a-button type="link" class="continue-shopping-link">
                Continue Shopping <a-icon type="arrow-right" />
              </a-button>
            </div>
          </div>
        </a-col>

        <a-col class="order-summary" style="margin-top: 24px">
          <!-- Voucher Section -->
          <a-form @submit="applyVoucher">
            <a-form-item
              label="Do you have a voucher or gift card?"
              :label-col="{ span: 24 }"
            >
              <a-input
                v-model:value="voucherCode"
                placeholder="Enter voucher code"
              />
            </a-form-item>
            <a-button type="primary" block htmlType="submit">
              Apply Code
            </a-button>
          </a-form>
        </a-col>
      </a-row>
    </a-layout>
  </Drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Drawer } from "ant-design-vue";

defineOptions({
  name: "BasketPage",
});
const visible = ref(false);

const showDrawer = () => {
  visible.value = true;
};

const cartItems = ref([
  {
    image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
    alt: "imac image",
    name: "PC system All in One APPLE iMac (2023)",
    quantity: 2,
    price: 1499,
  },
  {
    image:
      "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg",
    alt: "apple watch image",
    name: "Restored Apple Watch Series 8 (GPS) 41mm",
    quantity: 1,
    price: 598,
  },
]);

const summary = ref({
  originalPrice: 7592,
  savings: 299,
  storePickup: 99,
  tax: 799,
  total: 8191,
});

const voucherCode = ref("");

const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

const updateQuantity = (item) => {
  // Handle quantity change
};

const removeItem = (index) => {
  cartItems.value.splice(index, 1);
};

const addToFavorites = (item) => {
  // Handle add to favorites
};

const applyVoucher = () => {
  // Handle apply voucher code
};
</script>

<style lang="scss">
.shopping-cart {
  background-color: #fff;
  padding: 2rem 0;
}

.cart-container {
  max-width: 1200px;
}

.cart-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
}

.cart-items .cart-item {
  border: 1px solid #e0e0e0;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.cart-image img {
  width: 80px;
  height: 80px;
}

.cart-details {
  padding-left: 1rem;
}

.cart-item-name {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.cart-actions {
  margin-top: 0.5rem;
}

.add-favorite,
.remove-item {
  font-size: 0.875rem;
}

.cart-quantity,
.cart-price {
  text-align: right;
}

.cart-price {
  font-size: 1rem;
  font-weight: 600;
}

.order-summary {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
  border-radius: 8px;
}

.summary-details .summary-item,
.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.summary-total {
  font-size: 1rem;
  font-weight: 700;
  border-top: 1px solid #e0e0e0;
  padding-top: 0.5rem;
}

.savings {
  color: #28a745;
}

.checkout-btn {
  margin-top: 1rem;
}

.continue-shopping {
  text-align: center;
  margin-top: 1rem;
}

.continue-shopping span {
  font-size: 0.875rem;
  color: #666;
}

.continue-shopping-link {
  font-size: 0.875rem;
}
</style>
