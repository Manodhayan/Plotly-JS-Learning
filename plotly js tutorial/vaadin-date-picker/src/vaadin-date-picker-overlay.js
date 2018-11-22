/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';

/**
 * The overlay element.
 *
 * ### Styling
 *
 * See [`<vaadin-overlay>` documentation](https://github.com/vaadin/vaadin-overlay/blob/master/src/vaadin-overlay.html)
 * for `<vaadin-date-picker-overlay>` parts.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends Vaadin.OverlayElement
 * @memberof Vaadin
 * @private
 */
class DatePickerOverlayElement extends OverlayElement {
  static get is() {
    return 'vaadin-date-picker-overlay';
  }
}

customElements.define(DatePickerOverlayElement.is, DatePickerOverlayElement);
