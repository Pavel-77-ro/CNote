// v-click-outside.js
export default {
    beforeMount(el, binding) {
      // Define a click event handler on the document
      el._clickOutsideHandler_ = (event) => {
        // If the click was outside this element...
        if (!(el === event.target || el.contains(event.target))) {
          // ...then call the method provided in v-click-outside
          binding.value(event)
        }
      }
      document.addEventListener('click', el._clickOutsideHandler_)
    },
    unmounted(el) {
      // Clean up the event listener
      document.removeEventListener('click', el._clickOutsideHandler_)
      el._clickOutsideHandler_=null
    },
  }