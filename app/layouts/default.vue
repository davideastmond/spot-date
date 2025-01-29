<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="p-2 lg:flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>