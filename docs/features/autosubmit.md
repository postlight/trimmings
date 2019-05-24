---
layout: default
title: Autosubmit
---
Submit a form automatically on change.

## On a form

    <form data-trim-autosubmit>

When Autosubmit is applied to a form, a change on _any_ field within the form will submit it.

## On a field

    <input type="checkbox" data-trim-autosubmit>

When applied to indidual elements, only changes on those elements will submit. Changes on other elements in the same form that don't have `autosubmit` will not automatically submit the form.


