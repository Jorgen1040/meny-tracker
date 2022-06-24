# Meny Tracker

*FYI: This readme is going to be written in English, but the site itself is in Norwegian.*

Meny Tracker is a site that tracks price changes at the grocery store Meny, and displays graphs for each product in the catalogue. In addition you can get notifications for when your favorite product is on sale.

## The website

The website itself is built using NextJS, TypeScript and TailwindCSS. It also relies on some libraries for extra stuff (most notably Recharts for the price graphs).

## The backend

The backend is mostly managed by a Python script that collects price/product data every hour. You won't find the code for that in this repository since I don't want it to be abused to spam their (undocumented) API. This script then uploads all price changes and product changes to a MongoDB database, from which the website gets its data from.

## The future

Currently this site is in its early stages, with plenty of features still in the works/planned. The biggest milestones are as follows:

- [x] Collect price and product details in an efficient way
- [x] Display price data on website
- [ ] Utilize MongoDB's Atlas Search to create a search bar
- [ ] Allow users to get notifications when their favorite items are on sale:
  - [ ] as a push notifcation (via browser API)
  - [ ] as an email
  - [ ] SMS? (Most likely not)
- [ ] Add other grocery stores (KIWI)
- [ ] Add legal stuff? (Privacy Policy, and TOS)
- [ ] Refactor database to only include fields required, and add fields for stuff like if item was added newly and popularity on our site
