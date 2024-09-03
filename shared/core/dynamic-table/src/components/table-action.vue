<template>
  <!-- Loop through filtered actions and render them with a button and divider -->
  <article :style="getStyle">
    <template v-for="(actionItem, index) in filteredActions" :key="generateKey(actionItem, index)">
      <ActionItemRender v-bind="actionItem">
        <a-button
          type="link"
          size="small"
          :loading="loadingMap.get(generateKey(actionItem, index))"
          v-bind="actionItem"
        >
          {{ actionItem.label }}
        </a-button>
      </ActionItemRender>
      <!-- Conditionally render a vertical divider between action items -->
      <a-divider v-if="divider && index < filteredActions.length - 1" type="vertical" />
    </template>
  </article>
</template>

<script lang="tsx" setup>
  import { computed, ref, h, type FunctionalComponent } from 'vue';
  import { isFunction, isObject, isString } from 'lodash-es';
  import { Popconfirm, Tooltip, type TooltipProps } from 'ant-design-vue';
  import type { ActionItem } from '../types/tableAction';
  import type { CustomRenderParams } from '../types/column';
  import AButton from '~/shared/basic/button';
  import { Icon } from '~/shared/basic/icon';
  import { isPromise } from '~/shared/utils/is';

  // Functional component to handle action item rendering with popConfirm and tooltip
  const ActionItemRender: FunctionalComponent<ActionItem> = (action, { slots }) => {
    const { popConfirm, tooltip } = action;

    // Function to handle popConfirm rendering
    const renderWithPopConfirm = () => {
      if (popConfirm) {
        return h(Popconfirm, popConfirm, { default: slots.default });
      }
      return slots.default?.();
    };

    // Conditionally render with tooltip or just the popConfirm
    if (tooltip) {
      return h(Tooltip, getTooltipProps(tooltip), { default: renderWithPopConfirm });
    }
    return renderWithPopConfirm();
  };

  // Define props accepted by the component
  const props = defineProps({
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: () => [],
    },
    columnParams: {
      type: Object as PropType<CustomRenderParams>,
      default: () => ({}),
    },
    divider: {
      type: Boolean,
      default: true,
    },
    rowKey: [String, Number],
  });

  // Internal flag for marking click functions
  const clickFnFlag = '__TABLE_ACTION';
  // Map to track loading state for buttons
  const loadingMap = ref(new Map<string, boolean>());

  // Computed property that filters and processes action items
  const filteredActions = computed(() => {
    return props.actions
      .filter(filterActionItem) // Use the filter function to filter out unauthorized actions
      .map((item, index) => processActionItem(item, index)); // Process each action item
  });

  // Function to filter action items based on authorization
  const filterActionItem = (item: ActionItem) => {
    const auth = item?.auth;

    if (auth === undefined) {
      return true;
    }

    if (isString(auth) || isObject(auth)) {
      const hasPermission = true; // Replace with actual permission logic
      item.disabled = !hasPermission;

      if (item.disabled) {
        item.title = 'Sorry, you do not have permission for this action!';
      }

      return hasPermission;
    }

    return false;
  };

  const getStyle = computed(() => {
    return {
      display: 'flex',
      alignItems: 'center',
    };
  });

  // Function to process each action item: add click handling, icon rendering, etc.
  const processActionItem = (item: ActionItem, index: number) => {
    // Guard against recursion by adding a flag to the click function
    if (isFunction(item.onClick) && !hasClickFnFlag(item.onClick)) {
      const originalClickFn = item.onClick;

      item.onClick = async () => {
        const result = originalClickFn?.(props.columnParams);

        if (isPromise(result)) {
          const key = generateKey(item, index);
          loadingMap.value.set(key, true);
          await result.finally(() => loadingMap.value.delete(key));
        }
      };

      // Mark the click function to avoid recursive triggering
      setClickFnFlag(item.onClick);
    }

    // Conditionally render an icon with margin if a label exists
    if (item.icon) {
      item.icon = <Icon icon={item.icon} class={{ 'mr-1': !!item.label }} />;
    }

    return item;
  };

  // Utility function to check if a function has the click flag
  const hasClickFnFlag = (clickFn: Function) => {
    return Reflect.get(clickFn, clickFnFlag);
  };

  // Utility function to set the click function flag
  const setClickFnFlag = (clickFn: Function) => {
    Reflect.set(clickFn, clickFnFlag, true);
  };

  // Generate a unique key for each action item
  const generateKey = (actionItem: ActionItem, index: number) => {
    return `${props.rowKey}-${index}-${actionItem.label}`;
  };

  // Get the tooltip properties based on the provided tooltip data
  const getTooltipProps = (tooltip: ActionItem['tooltip']): TooltipProps => {
    return {
      getPopupContainer: () => document.body,
      placement: 'bottom',
      ...(isString(tooltip) ? { title: tooltip } : tooltip),
    };
  };
</script>
