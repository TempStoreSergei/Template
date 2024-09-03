import { onUnmounted, getCurrentInstance } from 'vue';
import type { ContextMenuItem } from '~/shared/basic/context-menu';
import { createContextMenu, destroyContextMenu } from '~/shared/basic/context-menu';
export type { ContextMenuItem };

export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu();
    });
  }
  return [createContextMenu, destroyContextMenu];
}
