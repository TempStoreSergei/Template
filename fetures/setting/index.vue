<template>
  <SettingOutlined @click="showDrawer" />
  <Drawer v-model:open="visible" placement="right" :closable="false">
    <Row class="tariff-plan-page">
      <Col span="24" class="tariff-plan-page__header">
        <PageHeader
          title="Tariff Plans"
          sub-title="Choose the best plan that suits your needs"
          ghost
        />
      </Col>

      <Col span="24" class="tariff-plan-page__content">
        <Row gutter="16" justify="center">
          <Col span="8" class="tariff-plan-page__content__plan">
            <Card title="Basic Plan" bordered class="tariff-plan-page__content__plan__card">
              <p class="tariff-plan-page__content__plan__price">$10/month</p>
              <ul class="tariff-plan-page__content__plan__features">
                <li>10 GB Storage</li>
                <li>100 GB Bandwidth</li>
                <li>Email Support</li>
              </ul>
              <Button type="primary" block> Choose Basic </Button>
            </Card>
          </Col>

          <Col span="8" class="tariff-plan-page__content__plan">
            <Card title="Standard Plan" bordered class="tariff-plan-page__content__plan__card">
              <p class="tariff-plan-page__content__plan__price">$20/month</p>
              <ul class="tariff-plan-page__content__plan__features">
                <li>50 GB Storage</li>
                <li>500 GB Bandwidth</li>
                <li>Priority Email Support</li>
              </ul>
              <Button type="primary" block> Choose Standard </Button>
            </Card>
          </Col>

          <Col span="8" class="tariff-plan-page__content__plan">
            <Card title="Premium Plan" bordered class="tariff-plan-page__content__plan__card">
              <p class="tariff-plan-page__content__plan__price">$30/month</p>
              <ul class="tariff-plan-page__content__plan__features">
                <li>100 GB Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>24/7 Support</li>
              </ul>
              <Button type="primary" block> Choose Premium </Button>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  </Drawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { SettingOutlined } from '@ant-design/icons-vue';
  import { Drawer, Row, Col, Card, Button, PageHeader } from 'ant-design-vue';

  defineOptions({
    name: 'TariffPage',
  });
  const visible = ref(false);

  const showDrawer = () => {
    visible.value = true;
  };
</script>

<style lang="less" scoped>
  .style-checbox-item {
    position: relative;
    cursor: pointer;

    &.active::after {
      content: '✔';
      position: absolute;
      right: 12px;
      bottom: 10px;
      color: var(--app-primary-color);
    }
  }

  input[type='color'] {
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    outline: none;
    appearance: none;

    &::-webkit-color-swatch-wrapper {
      background: var(--custom-color);
    }

    &::-webkit-color-swatch {
      display: none;
    }
  }
</style>
