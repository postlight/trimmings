---
layout: default
---
Not every product on the web needs to be an app. What happens to your process when you can focus on designing views and stop thinking about how to stitch them together? *Redact* is a zero-configuration Javascript library that adds a layer of smooth and fast in-page interaction to your web pages. All you have to do is add some hints to the HTML you already have.

This project follows in the footsteps of libraries like [Turbolinks](https://github.com/turbolinks/turbolinks/) and [Stimulus](https://stimulusjs.org). It believes that the best place for your business and rendering logic is on the server, that you should send your users HTML, and that Javascript is best suited for progressively-enhanced DOM manipulation.

- *Increased stability.* An HTML-powered product means your inputs and outputs are much easier to predict, which means your app is much easier to test. Progressively enhance your UX with stable code that you don't need to worry about.

- *App-like responsiveness.* Define subtle interactions with markup instead of code. Pair Redact with Turbolinks for an even more seamless experience!

- *Effortless modals.* Add a modal hint to any internal link and the contents of that link will open inline as a modal while preserving URLs and navigation history.

- *Easier caching.* Keep your pages small and focused and use Redact's powerful inline-embed features to compose them into complex views. Now you don't need to think about fragment caching—it's all just pages.

- *Eject as necessary.* Redact's API was inspired by Stimulus and the two libraries work happily together. Redact is designed to never allow extension with client-side code, but if you ever need to add your own logic, you can drop in Stimulus controllers without disrupting your workflow or your existing Redact hints.
