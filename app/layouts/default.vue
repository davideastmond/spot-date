<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="lg:flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>