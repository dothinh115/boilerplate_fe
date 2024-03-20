<template>
  <main>
    <div
      class="h-screen w-screen flex flex-col bg-[#2148c0] relative max-h-full"
    >
      <IconLoginTopRight class="absolute top-0 right-0" />
      <IconLoginBottomLeft class="absolute bottom-0 left-0" />
      <div class="max-h-full grid grid-cols-12 flex-grow gap-x-8 h-full">
        <div class="max-h-full lg:col-span-2 relative overflow-hidden">
          <TheSidebar />
        </div>
        <div
          class="lg:col-span-10 relative p-8 max-h-full h-full overflow-y-scroll"
        >
          <div class="h-full w-full p-4 max-h-full">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
