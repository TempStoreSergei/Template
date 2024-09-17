const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export default defineNuxtRouteMiddleware((to, from) => {
  if (!isAuthenticated()) {
    return navigateTo("/login");
  }
});
