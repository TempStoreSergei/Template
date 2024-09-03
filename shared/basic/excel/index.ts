import { withInstall } from 'src/shared/utils';
import impExcel from './src/ImportExcel.vue';
export { useExportExcelModal } from './src/ExportExcelModal';

export const ImpExcel = withInstall(impExcel);
// export const ExpExcelModal = withInstall(expExcelModal);
export * from './src/typing';
export * from './src/Export2Excel';
