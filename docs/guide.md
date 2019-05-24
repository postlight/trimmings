---
layout: default
title: Developing websites for Trim
---
It's natural to attempt a comparison of Trim with web development frameworks like React. But there's a big difference: React and Vue and Angular and other modern client-side Javascript libraries are designed to encapsulate render logic as well as interactions—you start with nothing, you write some Javascript, you end up with a website. Trim is meant to be added only after your website is serving HTML in order to eliminate the friction in a full-page-load-oriented user experience.

You can get here in many different ways: using Express, or Rails, or Wordpress, or Serverless, or countless other frameworks, or no framework at all. Once you've decided how you're going to be serving up all that HTML, this guide will help you design a reliable website that can take full advantage of Trim.

## Each thing has one URL

The web is _a web_ because of the many links between its many pages. A link only really works when it can point somewhere, and that means that all your things need their own URLs.

When you're in the early stages of designing your website, it's important to think about what your _things_ are. On a website for a non-profit, those _things_ might be conceptual—a mission statement, an org chart—as well as more tangible—staff members, events. An email client's things might be messages, contacts, and mailboxes. Those things also relate to each other—an org chart relates to staff members and a mailbox relates to the messages it contains. You don't have to model out all of the details of each thing at the very beginning, but the sooner you can identify your network of things, the better-equipped you'll be to start putting those things on the web.

As you might have guessed, each of your things should have a URL, and those relationships will be links from the page at one URL to another.

## Each URL has one thing

As you start laying out your content across many interlinked pages, be careful not to repeat yourself too much. For ease of use, you may want your mailbox page to include the full content of each of its related messages, but copying all of each message's content into its related mailbox page can quickly become unwieldy. Instead, pick a small amount of information that uniquely identifies one message—perhaps a subject and the sender's name—and use that information as a link to the full message.

> If you really want all of that linked content to show up on a related page, you can use [Trim's `embed` feature](/features/embed) to lazy-load it—but you still start with a link!

## Modeling your data

If you're used to thinking of HTML as the technology beneath your JSX, or just a means to apply CSS to your content, it can be hard to thing of it as anything else. But on the web, [HTML is inevitable][track-changes], and it's one of the most important tools you have. A Trim website prioritizes HTML above everything else (except the URL).

HTML is not just the tags that hold your content. HTML describes your data and imposes hierarchy. In a client-side-rendering world, your data likely comes from an API request that returns JSON. You'd then push that JSON through some Javascript to produce HTML. In Trim's world, all of this happens much earlier in the process. Your user's browser will only ever receive HTML! Take all of the thoughts you'd put into a JSON API, with its many objects and attributes and relationships—all your _things_—and replace the JSON with HTML. Now we're getting somewhere.

## Working with designers

Visual design and information design are complementary disciplines. If you're working on a brand-new project, your designer may have already produced some UI mockups as part of an exploratory process before anyone started modeling the data. (Your designer may even be you!) Starting with screens is fine, but before turning those screens into code, don't forget to identify your _things_. It's possible that one mockup might conflate many objects. That's not a problem with the design, but it could be a signal that this design does not represent a single page. Consider alternate views of the data presented here—one view per thing. How will those views differ from this view in order to present that one thing as the primary content? How does the exercise of presenting these things individually affect the aggregate view?

When you feel like you have a good grasp on the boundaries between things, start thinking about URLs. The aggregate view most likely owns its primary data and links to secondary data. As in our email example, you can `embed` those secondary data.

### Related reading

https://en.wikipedia.org/wiki/Domain-driven_design
http://smethur.st/posts/64839140
https://www.smashingmagazine.com/2014/05/responsive-design-begins-with-the-url/
https://www.bbc.co.uk/blogs/internet/entries/5c236ed9-5895-366b-8f26-f46961274b04
