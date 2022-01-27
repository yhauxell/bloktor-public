<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div
    class="fixed z-10 inset-0 overflow-y-auto min-h-full min-w-full h-screen w-screen"
  >
    <div
      class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0 min-w-screen h-screen w-screen"
    >
      <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full"
        v-bind="$attrs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div v-if="closable"
          class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
          @click="$emit('close')"
        >
          <svg
            class="text-white"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
            ></path>
          </svg>
        </div>
        <div class="bg-white pt-5 pb-4 sm:pb-4 w-full h-full">
          <div class="sm:flex sm:items-start w-full h-full">
            <div
              class="w-full mt-3 text-center sm:mt-0 sm:text-left h-full flex flex-col"
            >
              <slot name="header">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900 mx-6"
                  id="modal-headline"
                >
                  {{ title }}
                </h3>
              </slot>
              <div class="flex flex-col flex-grow">
                <div class="mt-2 sm:p-6 flex-grow overflow-auto">
                  <slot name="content"></slot>
                </div>
                <div
                v-if="$slots.actions"
                  class="bg-gray-50 py-3 flex justify-end px-6"
                >
                  <slot name="actions"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: "Bloktor says"
    },

    closable: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style>
</style>