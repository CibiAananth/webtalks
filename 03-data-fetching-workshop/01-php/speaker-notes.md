The big idea: There was no "data fetching" as we know it. The server was the application. The browser was just a display.
Sub-topics:
1.1 — How the web actually worked in the beginning

What happens when you type a URL and hit enter — DNS, TCP, HTTP request, server processes, HTML response, browser renders
The request-response cycle is the entire interaction model. Every click, every form submit = full page reload
The browser is a "dumb terminal" — it just renders what the server sends
Takeaway: The browser had zero responsibility for data. It didn't fetch anything. It received everything.

1.2 — Server-rendered pages with PHP/JSP

How a PHP page works: the server runs your code, queries the database, stitches HTML together, sends it down
Show a real PHP example — a user profile page that queries MySQL and renders HTML inline
The <?php echo $user->name ?> pattern — data and markup living together
Why this was actually fine for most websites in 2000-2005
Takeaway: Data fetching happened on the server, before the page even reached the browser. There were no loading spinners. No skeleton screens. The page either showed up complete, or it didn't show up at all.

1.3 — Forms and the POST-redirect-GET pattern

How user input worked: HTML <form> with action and method
The browser sends a POST, the server processes it, responds with a redirect, browser makes a new GET request, full page reloads
Why this meant every interaction was slow but predictable
No client-side validation (or very minimal with inline JS)
Takeaway: "Interactivity" meant the server doing work and sending back a whole new page. The UX was clunky but the mental model was dead simple — the server is always the source of truth.

1.4 — What was actually good about this model

No state synchronization problems — the server always had the latest data
No caching bugs — every page load was fresh
SEO worked perfectly — crawlers got the same HTML users did
Accessibility was straightforward — standard HTML elements, standard behavior
Takeaway: We'll keep coming back to this. A lot of the problems we're solving today in 2025 are problems we created by moving away from this model. Understanding what we gave up helps you understand why frameworks are circling back.

1.5 — What was painful about this model

Full page reloads for everything — clicking "like" on a post reloads the entire page
Server load was high — every tiny interaction is a full roundtrip
No rich interactivity — no drag and drop, no real-time updates, no smooth transitions
Gmail and Google Maps in 2004-2005 showed everyone what was possible if the browser could do more
Takeaway: The pain of full page reloads drove the entire next era. Gmail proved that the browser could behave like a desktop app, and everyone wanted that.

Bridge to next session: "So the browser was just a display. But Gmail changed everything. How? There was a hidden API in Internet Explorer that nobody expected to become the foundation of modern web apps — XMLHttpRequest."


1. What else existed besides PHP?
PHP was the most popular, but there were several others:
CGI scripts (Common Gateway Interface) — the original way to make dynamic web pages, dating back to 1993. You could write a script in Perl, C, or Python, and the web server (usually Apache) would execute it on each request and return the output as HTML. It was slow because it spawned a new process for every single request. Perl was the dominant CGI language in the mid-90s — the "duct tape of the internet."
ASP (Active Server Pages) — Microsoft's answer, launched in 1996. It ran on IIS (Internet Information Services) on Windows servers. You wrote VBScript or JScript inline with HTML, very similar to PHP's model. It evolved into ASP.NET in 2002, which was more structured and enterprise-focused. A lot of corporate intranets and enterprise apps were built on ASP/.NET.
JSP (JavaServer Pages) and Java Servlets — Sun Microsystems' approach. JSP let you embed Java code in HTML (like PHP), while Servlets were pure Java classes that handled requests. This was huge in enterprise/banking/fintech because Java was seen as more "serious" and scalable. Banks, airlines, and large e-commerce sites often ran on Java. The tooling was heavy — you needed Tomcat or JBoss or WebSphere application servers.
ColdFusion — Allaire (later Macromedia, then Adobe) launched this in 1995. It used its own tag-based language (CFML) that looked like HTML: <cfquery>, <cfoutput>. Very popular in the late 90s and early 2000s for rapid development. Some government and media sites still run on it.
Ruby on Rails — arrived in 2004 and was a game-changer. DHH (David Heinemeier Hansson) extracted it from Basecamp. Rails introduced "convention over configuration" — you follow the framework's structure and things just work. It popularized MVC (Model-View-Controller) on the web, database migrations, and the idea that developer happiness matters. Twitter, GitHub, Shopify all started on Rails. It influenced every framework that came after it, including Django (Python, 2005), Laravel (PHP, 2011), and even the philosophy behind Next.js and Remix.
Django — Python's answer to Rails, released in 2005. Built by the team at the Lawrence Journal-World newspaper. Similar MVC philosophy (they called it MTV — Model-Template-View). Instagram was famously built on Django.
So the landscape was roughly: Perl CGI for the early web, PHP for the masses, ASP for Microsoft shops, Java for enterprise, ColdFusion for rapid dev, and then Rails/Django brought a new wave of developer-friendly frameworks. But PHP dominated the sheer volume — WordPress alone (built on PHP) powers a massive chunk of the web even today.

3. Why rich interactions weren't possible, and how stock/trading sites worked
This is a really interesting question because the answer is nuanced.
Why drag and drop / rich interactivity wasn't practical:
It wasn't that JavaScript couldn't do drag and drop — technically, you could write mouse event handlers in JS even in the late 90s. The problems were:
Browser inconsistency was brutal. IE 5 had one event model, Netscape had another, and they disagreed on basically everything — how events bubbled, how you accessed the mouse position, how you modified the DOM. Writing cross-browser JavaScript was like writing three different programs. Any complex UI interaction would break in at least one browser.
The DOM was slow and poorly specified. Manipulating DOM elements was expensive, and browsers weren't optimized for it. Moving an element smoothly across the screen required manually updating style.left and style.top on a setInterval — there was no requestAnimationFrame, no CSS transitions, no transforms. It was janky.
No developer tooling. No DevTools, no console.log (you used alert() to debug), no source maps, no linting. Building complex interactive features was pain with almost no debugging support.
JavaScript was seen as a toy language. Serious developers wrote server-side code. JS was for form validation and maybe a dropdown menu. The idea that you'd build a complex drag-and-drop interface in JavaScript was seen as irresponsible — it would definitely break for some users, and there was no graceful fallback.
So for anything truly interactive, people used plugins:
Flash (Macromedia/Adobe) — this was the primary tool for rich interactive experiences from ~1998-2012. Games, interactive charts, video players, complex UIs — all Flash. It ran in a browser plugin with its own runtime, so browser inconsistencies didn't matter. YouTube's original player was Flash. Most online trading platforms used Flash-based charts.
Java Applets — embedded Java applications in the browser. Heavier than Flash, but could do serious computation. Some trading platforms used Java applets for their order books and real-time charts.
ActiveX Controls (IE only) — Microsoft's plugin system. Many enterprise/banking apps used ActiveX controls for rich functionality, but they only worked in Internet Explorer on Windows.
How stock market / trading sites actually worked:
This is where it gets interesting because there were different tiers:
Basic stock websites (Yahoo Finance, Moneycontrol) used auto-refresh. The page had a <meta http-equiv="refresh" content="30"> tag that told the browser to reload the entire page every 30 seconds. Or they used a server-side trick: the HTTP response would trickle in slowly (called "long polling" or "Comet") — the server would keep the connection open and push new data down the wire. But the UI still felt static.
Professional trading terminals weren't web apps at all. Bloomberg Terminal, Reuters Eikon, MetaTrader — these were native desktop applications written in C++ or Java, connecting directly to data feeds over TCP sockets. They had real-time price updates, complex charting, drag-and-drop order management — none of this ran in a browser. Professional traders never used websites for actual trading in the early 2000s.
Mid-tier web trading platforms used a combination of Java applets (for the real-time chart and order book) embedded in a server-rendered HTML page (for account info, portfolio). The applet maintained a persistent connection to the server for live price updates. When you placed a trade, sometimes the applet handled it, sometimes it submitted a form like any other PHP page.
The key insight for your workshop: Real-time updates in the browser were essentially impossible without plugins or hacks until WebSockets arrived (standardized in 2011) and Server-Sent Events. The server-rendered model was fundamentally request-response — the browser asks, the server answers, and then the connection closes. There was no way for the server to push data to the browser. Every "live update" was either a hack (long polling, hidden iframes that keep loading) or a plugin (Flash/Java).
