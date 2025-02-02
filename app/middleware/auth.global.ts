export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth();

  switch (to.path) {
    case "/auth/sign-in":
    case "/":
      return;
  }

  if (status.value === "unauthenticated") {
    return navigateTo("/auth/sign-in");
  }
});
