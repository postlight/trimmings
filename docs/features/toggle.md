---
layout: default
title: Toggle
---
Controls a class on a target element when the user interacts with the current element.

## Arguments

1. The selector of an element to modify: `.my-element`
2. The class to toggle: `some-class`

Arguments must be separated by a comma and (optionally) whitespace. If no element can be found at the target selector, this feature will have no effect. Also, note that only the _first_ element found will be toggled—that is, `querySelector` rather than `querySelectorAll`.

## On a button

    <button data-trim-toggle=".diagram, diagram--highlighted">
      Highlight diagram
    </button>

When used on a `<button>`, the class is toggled every time the button is clicked. If the target element has the class when the page loads, the first button click will remove the element. Even if the class is added or removed by some other means (i.e. Javascript or another `toggle` element), the button click will always toggle the class based on the current state of the element.

## On a text input

    <input type="text" data-trim-toggle=".text-form, form--filled" />

On a `<input>` with type `text`, the class's presence is synced with the presence of a value. If the field contains _any_ text—even just whitespace—the class will be added to the target element. If the field is empty, the class will be removed. Trim will sync the class state whenever the field triggers an `input` or `change` event.

## Radios and checkboxes

    <input type="radio" name="color" value="green" data-trim-toggle=".radio-status, green-checked" />
    <input type="radio" name="color" value="blue" data-trim-toggle=".radio-status, blue-checked" />

On an `<input>` of type `checkbox` or `radio`, the class's presence is synced with the checked state of the input: if the input is checked, the class is added.

Note that when a radio button is checked, other radio buttons with the same `name` attribute will be unchecked. If those elements _also_ have Toggle hints, their statuses will be updated at the same time. In our example here, clicking the radio button with value `"green"` will add the class `green-checked` to our element with class `radio-status`; proceeding to click the radio button with value `"blue"` will add the class `blue-checked` to our element with class `radio-status` and _remove_ the class `green-checked`.

## Consider the details

Trim's maintainers recommend using Toggle only for visual enhancements and not to disclose content. For disclosure, we recommend using the native and more accessible [`<details>` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details).
