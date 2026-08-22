import { photos } from "@/lib/site";

export type Sermon = {
  slug: string;
  title: string;
  speaker: string;
  /** Display date. */
  date: string;
  /** ISO date for sorting. */
  iso: string;
  tag: string;
  scripture: string;
  image: string;
  summary: string[];
};

export const sermons: Sermon[] = [
  {
    slug: "the-grace-called-favour",
    title: "The grace called favour",
    speaker: "Minister T. Adeyemi",
    date: "May 18, 2026",
    iso: "2026-05-18",
    tag: "Grace",
    scripture: "Psalm 5:12",
    image: photos.word,
    summary: [
      "Favour is not luck, and it is not reserved for a lucky few. In this message we walk through Psalm 5:12 and see a God who deliberately surrounds His own — at the lecture hall, in the exam room, and in the small rooms of campus life nobody sees.",
      "The invitation is simple: stop performing for what grace already provided. Come and learn what it means to be the person heaven smiles on, and how that smile changes the way you carry a semester.",
    ],
  },
  {
    slug: "life-giving-spirits",
    title: "Life-giving spirits",
    speaker: "Sister Favour O.",
    date: "May 11, 2026",
    iso: "2026-05-11",
    tag: "Identity",
    scripture: "1 Corinthians 15:45",
    image: photos.gathering,
    summary: [
      "There is a difference between being alive and being life-giving. Drawing on 1 Corinthians 15, this teaching traces the Adam-life we inherit and the Spirit-life we receive, and what each one produces in friendships, pressure, and purpose.",
      "By the end, the question is not whether you attend things, but what grows wherever you are planted. Carry life into the room — that is the family standard.",
    ],
  },
  {
    slug: "when-prayer-becomes-home",
    title: "When prayer becomes home",
    speaker: "Brother David A.",
    date: "May 04, 2026",
    iso: "2026-05-04",
    tag: "Prayer",
    scripture: "Matthew 6:6",
    image: photos.prayer,
    summary: [
      "Prayer was never meant to be a performance or a panic button. In this message we return to the quiet room of Matthew 6 and find a kind of prayer that feels less like a meeting and more like coming home.",
      "A practical, honest word for anyone whose prayer life has gone dry — including the small disciplines that rebuild it, one honest sentence at a time.",
    ],
  },
  {
    slug: "a-faith-that-finds-its-feet",
    title: "A faith that finds its feet",
    speaker: "Minister K. Adebayo",
    date: "April 27, 2026",
    iso: "2026-04-27",
    tag: "Faith",
    scripture: "Hebrews 11:1",
    image: photos.worship,
    summary: [
      "Faith that never reaches the feet is only a feeling. From Hebrews 11 we follow faith out of the seats and into decisions — course choices, conversations, money, and the courage to keep following when the path is unclear.",
      "This is a message for anyone whose belief has outgrown their habits, and who is ready to walk it out on campus this week.",
    ],
  },
];

export const getSermon = (slug: string) =>
  sermons.find((sermon) => sermon.slug === slug);
