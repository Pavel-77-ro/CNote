// v-click-outside.js
export default {
    beforeMount(el, binding) {
      el._clickOutsideHandler_ = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event)
        }
      }
      document.addEventListener('click', el._clickOutsideHandler_)
    },
    unmounted(el) {
      document.removeEventListener('click', el._clickOutsideHandler_)
      el._clickOutsideHandler_=null
    },
  }