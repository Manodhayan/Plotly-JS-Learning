import './vaadin-date-picker-overlay.js';
import './vaadin-date-picker-overlay-content.js';
import './vaadin-month-calendar.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/mixins/field-button.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="material-date-picker" theme-for="vaadin-date-picker">
  <template>
    <style include="material-field-button">
      :host {
        display: inline-flex;
        -webkit-tap-highlight-color: transparent;
      }

      [part="clear-button"]::before {
        content: var(--material-icons-clear);
      }

      [part="toggle-button"]::before {
        content: var(--material-icons-calendar);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
