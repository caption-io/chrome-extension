import Popup from 'src/components/Popup.svelte';

function loadPopup() {
    const app = new Popup({
      target: document.body,
  });
}

document.addEventListener('DOMContentLoaded', loadPopup);
