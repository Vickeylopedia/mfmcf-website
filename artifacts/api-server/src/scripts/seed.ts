/**
 * Seeds the current site content into the database so the admin-managed
 * pages look identical to the static build. Safe to re-run: it only inserts
 * rows that do not exist yet (matched by slug / title).
 *
 * Usage: pnpm --filter @workspace/api-server run seed   (requires DATABASE_URL)
 */
import { db } from "@workspace/db";
import {
  galleryItemsTable,
  newsPostsTable,
  sermonsTable,
} from "@workspace/db/schema";

const sermonSeed = [
  {
    slug: "the-grace-called-favour",
    title: "The grace called favour",
    speaker: "Minister T. Adeyemi",
    date: "May 18, 2026",
    iso: "2026-05-18",
    tag: "Grace",
    scripture: "Psalm 5:12",
    summary: [
      "Favour is not luck, and it is not reserved for a lucky few. In this message we walk through Psalm 5:12 and see a God who deliberately surrounds His own — at the lecture hall, in the exam room, and in the small rooms of campus life nobody sees.",
      "The invitation is simple: stop performing for what grace already provided. Come and learn what it means to be the person heaven smiles on, and how that smile changes the way you carry a semester.",
    ],
    artworkUrl: "/assets/image_1787353067577.png",
    audioUrl: null,
  },
  {
    slug: "life-giving-spirits",
    title: "Life-giving spirits",
    speaker: "Sister Favour O.",
    date: "May 11, 2026",
    iso: "2026-05-11",
    tag: "Identity",
    scripture: "1 Corinthians 15:45",
    summary: [
      "There is a difference between being alive and being life-giving. Drawing on 1 Corinthians 15, this teaching traces the Adam-life we inherit and the Spirit-life we receive, and what each one produces in friendships, pressure, and purpose.",
      "By the end, the question is not whether you attend things, but what grows wherever you are planted. Carry life into the room — that is the family standard.",
    ],
    artworkUrl: "/assets/image_1787352840643.png",
    audioUrl: null,
  },
  {
    slug: "when-prayer-becomes-home",
    title: "When prayer becomes home",
    speaker: "Brother David A.",
    date: "May 04, 2026",
    iso: "2026-05-04",
    tag: "Prayer",
    scripture: "Matthew 6:6",
    summary: [
      "Prayer was never meant to be a performance or a panic button. In this message we return to the quiet room of Matthew 6 and find a kind of prayer that feels less like a meeting and more like coming home.",
      "A practical, honest word for anyone whose prayer life has gone dry — including the small disciplines that rebuild it, one honest sentence at a time.",
    ],
    artworkUrl: "/assets/image_1787353043632.png",
    audioUrl: null,
  },
  {
    slug: "a-faith-that-finds-its-feet",
    title: "A faith that finds its feet",
    speaker: "Minister K. Adebayo",
    date: "April 27, 2026",
    iso: "2026-04-27",
    tag: "Faith",
    scripture: "Hebrews 11:1",
    summary: [
      "Faith that never reaches the feet is only a feeling. From Hebrews 11 we follow faith out of the seats and into decisions — course choices, conversations, money, and the courage to keep following when the path is unclear.",
      "This is a message for anyone whose belief has outgrown their habits, and who is ready to walk it out on campus this week.",
    ],
    artworkUrl: "/assets/image_1787352852059.png",
    audioUrl: null,
  },
];

const newsSeed = [
  {
    title: "The room is ready for you",
    date: "22 MAY 2026",
    iso: "2026-05-22",
    tag: "Welcome",
    body: "Whether it is your first Sunday or your fiftieth, there is an open seat and a familiar face waiting at the New Lecture Theatre.",
    full:
      "Doors open from 8:30 AM, and the welcome team will be outside to walk you in if it is your first time. Come as you are — jeans, hostel wear, Sunday best; nobody is keeping score. After the service, stay back for a few minutes so we can meet you properly. That is the whole point of family.",
    artworkUrl: null,
  },
  {
    title: "Exam season, softer landing",
    date: "16 MAY 2026",
    iso: "2026-05-16",
    tag: "Community",
    body: "We are keeping the family rooms open through exams. Come study, pray, breathe, or simply sit with people who understand.",
    full:
      "From Monday to Friday, 10 AM to 4 PM, one of the family rooms stays open as a quiet study space — power points, quiet playlists, and someone to pray with when a paper goes badly. There is also a short prayer walk every evening at 6 PM for anyone who wants to end the study day with peace instead of panic.",
    artworkUrl: null,
  },
  {
    title: "A new rhythm for midweek",
    date: "03 MAY 2026",
    iso: "2026-05-03",
    tag: "Gatherings",
    body: "Midweek Recharge now meets every Wednesday at 5:00 PM. Short teaching, open prayer, honest conversation.",
    full:
      "We heard the family clearly: Sundays carry the celebration, but the middle of the week needs somewhere to land. So Midweek Recharge is now weekly — thirty minutes of teaching that connects to real campus life, then open prayer and honest conversation until nobody needs to talk anymore. Bring your questions; bring your friend who has questions.",
    artworkUrl: null,
  },
];

const gallerySeed = [
  {
    title: "A Sunday with the family",
    type: "Worship",
    desc: "The room settles, the voices rise, and somebody always saves you a seat.",
    imageUrl: "/assets/image_1787352840643.png",
    position: 1,
  },
  {
    title: "Joy looks good on us",
    type: "Community",
    desc: "Three friends, one bright afternoon, and absolutely no shortage of laughter.",
    imageUrl: "/assets/image_1787352917176.png",
    position: 2,
  },
  {
    title: "Held in prayer",
    type: "Worship",
    desc: "The quiet moments count, too.",
    imageUrl: "/assets/image_1787353043632.png",
    position: 3,
  },
  {
    title: "The Word in the room",
    type: "Teaching",
    desc: "Listening closely. Leaving changed.",
    imageUrl: "/assets/image_1787353067577.png",
    position: 4,
  },
  {
    title: "Room for every story",
    type: "Community",
    desc: "Different backgrounds, one table.",
    imageUrl: "/assets/image_1787352852059.png",
    position: 5,
  },
  {
    title: "The whole family, gathered",
    type: "Community",
    desc: "Full rooms, full hearts — the chapter in one frame.",
    imageUrl: "/assets/fellowship-community.jpg",
    position: 6,
  },
  {
    title: "Every voice welcome",
    type: "Worship",
    desc: "Loud or quiet, off-key or on — it all counts as praise here.",
    imageUrl: "/assets/fellowship-worship.jpg",
    position: 7,
  },
];

async function main() {
  for (const sermon of sermonSeed) {
    await db.insert(sermonsTable).values(sermon).onConflictDoNothing({
      target: sermonsTable.slug,
    });
  }

  const existingNews = await db
    .select({ title: newsPostsTable.title })
    .from(newsPostsTable);
  const newsTitles = new Set(existingNews.map((row) => row.title));
  const newsToInsert = newsSeed.filter((post) => !newsTitles.has(post.title));
  if (newsToInsert.length) {
    await db.insert(newsPostsTable).values(newsToInsert);
  }

  const existingGallery = await db
    .select({ title: galleryItemsTable.title })
    .from(galleryItemsTable);
  const galleryTitles = new Set(existingGallery.map((row) => row.title));
  const galleryToInsert = gallerySeed.filter(
    (item) => !galleryTitles.has(item.title),
  );
  if (galleryToInsert.length) {
    await db.insert(galleryItemsTable).values(galleryToInsert);
  }

  console.log(
    `Seed complete: ${sermonSeed.length} sermons, ${newsSeed.length} news notes, ${gallerySeed.length} gallery items checked; existing rows untouched.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
