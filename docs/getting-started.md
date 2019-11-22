---
layout: default
title: Getting Started
---
It's natural to attempt a comparison of Trimmings with web development frameworks like React. But there's a big difference: React and Vue and Angular and other modern client-side Javascript libraries are designed to encapsulate render logic as well as interactions—you start with nothing, you write some Javascript, you end up with a website. Trimmings is meant to be added only after your website is serving HTML in order to eliminate the friction in a full-page-load-oriented user experience.

You can get here in many different ways: using Express, or Rails, or Wordpress, or Serverless, or countless other frameworks, or no framework at all. Once you've decided how you're going to be serving up all that HTML, this guide will help you design a reliable website that can take full advantage of Trimmings.

## Each thing has one URL

The web is _a web_ because of the many links between its many pages. A link only really works when it can point somewhere, and that means that all your things need their own URLs.

When you're in the early stages of designing your website, it's important to think about what your _things_ are. On a website for a non-profit, those _things_ might be conceptual—a mission statement, an org chart—as well as more tangible—staff members, events. An email client's things might be messages, contacts, and mailboxes. Those things also relate to each other—an org chart relates to staff members and a mailbox relates to the messages it contains. You don't have to model out all of the details of each thing at the very beginning, but the sooner you can identify your network of things, the better-equipped you'll be to start putting those things on the web.

As you might have guessed, each of your things should have a URL, and those relationships will be links from the page at one URL to another.

## Each URL has one thing

As you start laying out your content across many interlinked pages, be careful not to repeat yourself too much. For ease of use, you may want your mailbox page to include the full content of each of its related messages, but copying all of each message's content into its related mailbox page can quickly become unwieldy. Instead, pick a small amount of information that uniquely identifies one message—perhaps a subject and the sender's name—and use that information as a link to the full message.

> If you really want all of that linked content to show up on a related page, you can use [Trimmings's `embed` feature](/features/embed) to lazy-load it—but you still start with a link!

## Modeling your data

If you're used to thinking of HTML as the technology beneath your JSX, or just a means to apply CSS to your content, it can be hard to thing of it as anything else. But on the web, [HTML is inevitable](https://postlight.com/trackchanges/back-to-html-introducing-trimmings), and it's one of the most important tools you have. A Trimmings website prioritizes HTML above everything else (except the URL).

HTML is not just the tags that hold your content. HTML describes your data and imposes hierarchy. In a client-side-rendering world, your data likely comes from an API request that returns JSON. You'd then push that JSON through some Javascript to produce HTML. In Trimmings's world, all of this happens much earlier in the process. Your user's browser will only ever receive HTML! Take all of the thoughts you'd put into a JSON API, with its many objects and attributes and relationships—all your _things_—and replace the JSON with HTML. Now we're getting somewhere.

## Your first feature

Let's imagine you have three pages on your site. At the top of each page are three links. These links each point to one of the pages. The list of links is styled identically on each page, so to the user, it's not three lists of three links—it's just one menu.

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Apples, one of your favorite foods</title>
  </head>
  <body>
    <h1>Greetings! These are your favorite foods.</h1>
    <nav>
      <a href="/apples">Apples</a>
      <a href="/bananas">Bananas</a>
      <a href="/cake">Cake</a>
    </nav>
    <main>
      <h1>Apples</h1>
      <p>You think apples are just great.</p>
    </main>
  </body>
</html>
```

This works great as-is for helping your user view each of your pages, but let's introduce a simple (and contrived) problem: when a user visits one of these pages for the first time, you want to present them with a random greeting, followed by that menu and the content of the page. You set up some backend logic that picks from your possible greetings and includes one in the HTML of the page.

This is working fine, except that the greeting changes as the user navigates. How can we keep it the same? We could introduce a cookie that is read each time the page loads, to ensure that we're staying consistent. But cookies introduce privacy concerns and legal requirements, and are generally just a heavy solution for such a small feature. Maybe we can use Trimmings instead!

Trimmings has a feature called _Inline_, which augments a standard link click. Given two arguments—`from` and `to`—it will load the linked URL remotely, use `from` to select some content from the linked document, find an element in the current document with the selector `to`, and insert that loaded content there. Done carefully, this can have the effect of loading one portion of the linked page without affecting the rest of it. That's exactly what we need!

Enabling this feature is easy. Take the HTML we already have and add some `data-trimmings-inline` attributes to our links:

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Apples, one of your favorite foods</title>
  </head>
  <body>
    <!-- The next line is generated randomly on the backend -->
    <h1>Wow, take a look at your favorite foods</h1>
    <nav>
      <a
        data-trimmings-inline="from: main, to: main, updateTitle: true, updateLocation: true"
        href="/apples"
      >
        Apples
      </a>
      <a
        data-trimmings-inline="from: main, to: main, updateTitle: true, updateLocation: true"
        href="/bananas"
      >
        Bananas
      </a>
      <a
        data-trimmings-inline="from: main, to: main, updateTitle: true, updateLocation: true"
        href="/cake"
      >
        Cake
      </a>
    </nav>
    <main>
      <h1>Apples</h1>
      <p>You think apples are just great.</p>
    </main>
  </body>
</html>
```

In this example, clicking any of our links will load `main` from the target URL and replace `main` on our current page. We also add `updateTitle` and `updateLocation` options to each one so that our `<title>` is updated, as well as the current URL displayed in the browser. Now our greeting (`h1`) can be generated and displayed once and will never update. We didn't have to write any Javascript, and our site still works without Javascript enabled! All of these pages are still just pages, and our links are still just links. We've _progressively enhanced_ our user experience to provide an additional feature when possible.

> If we refresh the page or open one of these links in a new tab, we won't see the same greeting anymore—the Trimmings Inline feature only intercepts in-page loads. If we needed those situations to also stay consistent, we'd probably want to use some form of persistence, like cookies (for consistence server-side rendering) or `localStorage` (for client-side manipulation). If you decided to make this change client-side, you can just write some vanilla Javascript that reads from localStorage and manipulates the DOM, or use jQuery, or Stimulus, or Backbone, or even React if you wanted to and are comfortable with your understanding of how it manipulates the DOM. Trimmings works just fine alongside other Javascript.)

With this first example, you've implemented a feature using Trimmings and learned the standard flow of Trimmings-enabled development: set up what you need in HTML, ensure your user's interactions all involve clicking links and buttons and submitting forms, decide how you want to see the document change when the user interacts with your elements, and then layer in the appropriate Trimmings feature. With a little practice and careful planning, you'll be an expert!

## Working with designers

Visual design and information design are complementary disciplines. If you're working on a brand-new project, your designer may have already produced some UI mockups as part of an exploratory process before anyone started modeling the data. (Your designer may even be you!) Starting with screens is fine, but before turning those screens into code, don't forget to identify your _things_. It's possible that one mockup might conflate many objects. That's not a problem with the design, but it could be a signal that this design does not represent a single page. Consider alternate views of the data presented here—one view per thing. How will those views differ from this view in order to present that one thing as the primary content? How does the exercise of presenting these things individually affect the aggregate view?

When you feel like you have a good grasp on the boundaries between things, start thinking about URLs. The aggregate view most likely owns its primary data and links to secondary data. As in our email example, you can `embed` those secondary data.

## Related reading

- [Domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design)
- [One from the archive: the /programmes manifesto](http://smethur.st/posts/64839140)
- [Responsive Design Begins with the URL](https://www.smashingmagazine.com/2014/05/responsive-design-begins-with-the-url/)
- [BBC Programme pages: content driven responsive redesign](https://www.bbc.co.uk/blogs/internet/entries/5c236ed9-5895-366b-8f26-f46961274b04)
