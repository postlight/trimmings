![Trimmings logo](trimmings.svg)

# Trimmings

What happens to your web development process when you can focus on designing views and stop thinking about how to stitch them together? *Trimmings* is a zero-configuration Javascript library that adds a layer of smooth and fast in-page interaction to your web pages. All you have to do is add some hints to the HTML you already have.

This project follows in the footsteps of libraries like [Turbolinks](https://github.com/turbolinks/turbolinks/) and [Stimulus](https://stimulusjs.org). It believes that the best place for your business and rendering logic is on the server, that you should send your users HTML, and that Javascript is best suited for progressively-enhanced DOM manipulation. Trimmings is a set of patterns that allow you to add DOM manipulation to your app by adding `data-trimmings-*` attributes to your interactive elements. Less Javascript in your project means less risk.

Once you've built your website and it's serving HTML that's presented the way you like it, you can start adding Trimmings hints that will enhance the way your interactions behave.

Perhaps you have a link to a detail page that you'd like to open in a modal. The standalone page probably has a header and footer that you wouldn't want to render in your modal. That's no problem. Just add an `inline` hint to your link:

```
<a data-trimmings-inline=".detail-container, .modal-container" href="/photos/2">
  View as a modal
</a>
```

If your visitor clicks that link, the page will be fetched in the background, the element with the `detail-container` class will be extracted from the result, and it will be inserted in an element with the `modal-container` class that's already on the page. You can write CSS that will make this show up however you like. Now you have a modal! That's all there is to it!

## Installation

Just include `trimmings.js` in your `<head>`. That's it. Trimmings will automatically activate when your page loads—no need to think about lifecycles.

```
<script src="/trimmings.js"></script>
```

## Usage

Trimmings features are enabled on specific elements by adding `data-trimmings-*` attributes. For more details on usage of each Trimmings feature, please consult [the Trimmings handbook](https://postlight.github.io/trimmings).

## Contributing

If you've found a bug or you'd like to propose a new feature, [submit an issue](https://github.com/postlight/trimmings/issues) and let's talk about it!

We expect that all contributors to Trimmings will abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

🔬 A Labs project from your friends at [Postlight](https://postlight.com). Happy coding!
