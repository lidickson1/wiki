# Wiki Demo

This is a demo of a Wiki clone website that I built using Javascript, Bulma, and [Next.js](https://nextjs.org/). The original purpose of the website was to be a Wikipedia-like website for my group of friends where we documented our members and all of the events/hangouts/parties that have happened over the years. Due to privacy concerns, that site is private so I created this demo site and filled it with randomly generated fake/placeholder data using [Faker](https://fakerjs.dev/). The general theme is akin to a TV show where there are main characters, side characters, seasons, and events.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open the provided link in the terminal output with your browser to view the website (usually on port 3000).

## Content

All of the data on the website is randomly generated using [Faker](https://fakerjs.dev/). The file responsible for this is `generate.js`. After running it, it will generate the required data/files which are in the `people` folder and `events` folder.
