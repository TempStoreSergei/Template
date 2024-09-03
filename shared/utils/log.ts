const projectName = import.meta.env.VITE_APP_TITLE;

export const warn = (message: string) => {
  console.warn(`[${projectName} warn]: ${message}`);
};

export const error = (message: string): never => {
  throw new Error(`[${projectName} error]: ${message}`);
};
