export interface Executive {
  id: string;
  name: string;
  role: string;
  isCentral: boolean;
  department: string;
  image: string;
  quote?: string;
  scripture?: string;
}

export interface Tenure {
  id: "power-and-fire" | "davidic-generation";
  name: string;
  badge: string;
  session: string;
  status: "Present Tenure" | "Preceding Tenure";
  verseRef: string;
  verseText: string;
  vision: string;
  centrals: Executive[];
  executives: Executive[];
}

export const tenures: Tenure[] = [
  {
    id: "power-and-fire",
    name: "Tenure of Power and Fire",
    badge: "Current Leadership",
    session: "2025 / 2026 Academic Session",
    status: "Present Tenure",
    verseRef: "Psalm 104:4",
    verseText: "He makes His angels spirits, His ministers flames of fire.",
    vision:
      "Igniting spiritual revival, walking in daily power, and raising students who shine as lights across the lecture halls of FUNAAB.",
    centrals: [
      {
        id: "pf-pres",
        name: "Bro. Daniel Oluwasegun",
        role: "President",
        isCentral: true,
        department: "Agricultural and Bioresources Engineering",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
        quote:
          "Leading with holy fear, burning devotion, and a heart open to every brother and sister on campus.",
        scripture: "Acts 1:8",
      },
      {
        id: "pf-vp",
        name: "Bro. Emmanuel Adeyemi",
        role: "Vice President",
        isCentral: true,
        department: "Computer Science",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
        quote:
          "Committed to spiritual discipline, sound doctrine, and fostering genuine unity in the family.",
        scripture: "Romans 12:11",
      },
      {
        id: "pf-gen-sec",
        name: "Sis. Deborah Ayomide",
        role: "General Secretary",
        isCentral: true,
        department: "Plant Breeding and Seed Technology",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        quote:
          "Serving with order, administrative diligence, and warmth for every member of God's house.",
        scripture: "1 Corinthians 14:40",
      },
      {
        id: "pf-sis-coord",
        name: "Sis. Praise Oluwadamilola",
        role: "Sisters Coordinator",
        isCentral: true,
        department: "Veterinary Medicine",
        image:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80",
        quote:
          "Raising virtuous sisters filled with wisdom, prayer power, and modest godly poise.",
        scripture: "Proverbs 31:30",
      },
    ],
    executives: [
      {
        id: "pf-prayer",
        name: "Bro. Joshua Ayotunde",
        role: "Prayer Secretary",
        isCentral: false,
        department: "Animal Production and Health",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=80",
        quote: "Stirring the embers of intercession until righteousness breaks forth.",
        scripture: "1 Thessalonians 5:17",
      },
      {
        id: "pf-bible",
        name: "Bro. Victor Olatunji",
        role: "Bible Study Secretary",
        isCentral: false,
        department: "Soil Science and Land Management",
        image:
          "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=700&auto=format&fit=crop&q=80",
        quote: "Deep roots in the living scriptures for fruitfulness in every season.",
        scripture: "2 Timothy 2:15",
      },
      {
        id: "pf-fin",
        name: "Sis. Blessing Opeyemi",
        role: "Financial Secretary",
        isCentral: false,
        department: "Agricultural Economics",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&auto=format&fit=crop&q=80",
        quote: "Stewarding kingdom resources with transparency, wisdom, and faith.",
        scripture: "Luke 16:10",
      },
      {
        id: "pf-org",
        name: "Bro. Samuel Babatunde",
        role: "Organizing Secretary",
        isCentral: false,
        department: "Mechanical Engineering",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&auto=format&fit=crop&q=80",
        quote: "Ordering every detail of fellowship service with excellence and care.",
        scripture: "Ecclesiastes 9:10",
      },
      {
        id: "pf-choir",
        name: "Sis. Joy Adewale",
        role: "Choir Director",
        isCentral: false,
        department: "Pure and Applied Chemistry",
        image:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&auto=format&fit=crop&q=80",
        quote: "Leading heart worship that invites the glorious presence of God.",
        scripture: "Psalm 100:2",
      },
      {
        id: "pf-drama",
        name: "Bro. David Temitope",
        role: "Drama Coordinator",
        isCentral: false,
        department: "Agricultural Extension",
        image:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=80",
        quote: "Proclaiming the truth of redemption through dramatic arts and visual media.",
        scripture: "Mark 16:15",
      },
      {
        id: "pf-welfare",
        name: "Sis. Faith Eniola",
        role: "Welfare Secretary",
        isCentral: false,
        department: "Food Science and Technology",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&auto=format&fit=crop&q=80",
        quote: "Reaching out with genuine compassion to meet every practical need.",
        scripture: "Galatians 6:2",
      },
      {
        id: "pf-media",
        name: "Bro. Peter Temiloluwa",
        role: "Media and Publicity Director",
        isCentral: false,
        department: "Computer Science",
        image:
          "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=700&auto=format&fit=crop&q=80",
        quote: "Broadcasting the word of life across digital platforms with creativity.",
        scripture: "Matthew 5:14",
      },
      {
        id: "pf-tech",
        name: "Bro. Caleb Olumide",
        role: "Technical and Sound Secretary",
        isCentral: false,
        department: "Electrical and Electronics Engineering",
        image:
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&auto=format&fit=crop&q=80",
        quote: "Ensuring flawless sound and technical clarity in God's presence.",
        scripture: "Exodus 31:3",
      },
      {
        id: "pf-usher",
        name: "Sis. Esther Morufat",
        role: "Ushering Coordinator",
        isCentral: false,
        department: "Water Resources Management",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&auto=format&fit=crop&q=80",
        quote: "Welcoming worshippers with celestial joy, order, and radiant smiles.",
        scripture: "Psalm 84:10",
      },
      {
        id: "pf-follow",
        name: "Bro. Stephen Boluwatife",
        role: "Follow up and Visitation Secretary",
        isCentral: false,
        department: "Horticulture",
        image:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=700&auto=format&fit=crop&q=80",
        quote: "Walking alongside new brethren until Christ is formed in them.",
        scripture: "John 21:15",
      },
      {
        id: "pf-acad",
        name: "Sis. Grace Ayobami",
        role: "Academic Coordinator",
        isCentral: false,
        department: "Mathematical Sciences",
        image:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&auto=format&fit=crop&q=80",
        quote: "Guiding students to outstanding scholastic excellence in Jesus name.",
        scripture: "Daniel 1:17",
      },
    ],
  },
  {
    id: "davidic-generation",
    name: "Davidic Generation",
    badge: "Preceding Leadership",
    session: "2024 / 2025 Academic Session",
    status: "Preceding Tenure",
    verseRef: "1 Samuel 13:14",
    verseText:
      "A generation seeking after God's own heart, walking in praise, and building an enduring altar.",
    vision:
      "Laying deep foundations of worship, spiritual purity, and sacrificial love that continue to nourish the fellowship today.",
    centrals: [
      {
        id: "dg-pres",
        name: "Bro. Israel Oluwatosin",
        role: "President",
        isCentral: true,
        department: "Mechanical Engineering",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
        quote:
          "Anchoring our hearts to the altar of devotion and raising soldiers who fear God alone.",
        scripture: "Psalm 27:4",
      },
      {
        id: "dg-vp",
        name: "Bro. Timothy Ifeoluwa",
        role: "Vice President",
        isCentral: true,
        department: "Agricultural Economics and Farm Management",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
        quote:
          "Strengthening the brethren, guarding doctrine, and pursuing peace with all.",
        scripture: "Colossians 1:10",
      },
      {
        id: "dg-gen-sec",
        name: "Sis. Rebecca Oluwatoyin",
        role: "General Secretary",
        isCentral: true,
        department: "Biochemistry",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        quote:
          "Serving with precision, diligence, and gladness of spirit in the secret place and open floor.",
        scripture: "Colossians 3:23",
      },
      {
        id: "dg-sis-coord",
        name: "Sis. Abigail Morolake",
        role: "Sisters Coordinator",
        isCentral: true,
        department: "Nutrition and Dietetics",
        image:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80",
        quote:
          "Cultivating sisters grounded in purity, prayer, and sisterly affection.",
        scripture: "Psalm 144:12",
      },
    ],
    executives: [
      {
        id: "dg-prayer",
        name: "Bro. Elijah Adedayo",
        role: "Prayer Secretary",
        isCentral: false,
        department: "Physics",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=80",
        quote: "Birthing revival on our knees before the Throne of Grace.",
        scripture: "Jeremiah 33:3",
      },
      {
        id: "dg-bible",
        name: "Bro. Moses Olalekan",
        role: "Bible Study Secretary",
        isCentral: false,
        department: "Environmental Management and Toxicology",
        image:
          "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=700&auto=format&fit=crop&q=80",
        quote: "Unfolding the mystery of the Word to nourish every student believer.",
        scripture: "Psalm 119:105",
      },
      {
        id: "dg-fin",
        name: "Sis. Hannah Oluwaseun",
        role: "Financial Secretary",
        isCentral: false,
        department: "Agricultural Extension and Rural Development",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&auto=format&fit=crop&q=80",
        quote: "Integrity and fidelity in stewardship of kingdom treasury.",
        scripture: "1 Chronicles 29:14",
      },
      {
        id: "dg-org",
        name: "Bro. Matthew Babalola",
        role: "Organizing Secretary",
        isCentral: false,
        department: "Civil Engineering",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&auto=format&fit=crop&q=80",
        quote: "Laying solid arrangements so God's spirit moves unhindered.",
        scripture: "1 Corinthians 14:33",
      },
      {
        id: "dg-choir",
        name: "Bro. Philip Damilare",
        role: "Choir Director",
        isCentral: false,
        department: "Forestry and Wildlife Management",
        image:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=80",
        quote: "Harmonizing souls in songs of praise and holy adoration.",
        scripture: "Psalm 149:1",
      },
      {
        id: "dg-drama",
        name: "Sis. Dorcas Folasade",
        role: "Drama Coordinator",
        isCentral: false,
        department: "Aquaculture and Fisheries Management",
        image:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&auto=format&fit=crop&q=80",
        quote: "Painting the cross and salvation upon the hearts of students.",
        scripture: "1 Peter 2:9",
      },
      {
        id: "dg-welfare",
        name: "Sis. Comfort Titilayo",
        role: "Welfare Secretary",
        isCentral: false,
        department: "Home Science and Management",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&auto=format&fit=crop&q=80",
        quote: "No brother or sister left uncared for across our campus gates.",
        scripture: "Hebrews 13:16",
      },
      {
        id: "dg-media",
        name: "Bro. Paul Olawale",
        role: "Media and Publicity Director",
        isCentral: false,
        department: "Computer Science",
        image:
          "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=700&auto=format&fit=crop&q=80",
        quote: "Amplifying the kingdom sound with modern digital tools.",
        scripture: "Psalm 68:11",
      },
      {
        id: "dg-tech",
        name: "Bro. Gabriel Akinyemi",
        role: "Technical and Sound Secretary",
        isCentral: false,
        department: "Agricultural Engineering",
        image:
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&auto=format&fit=crop&q=80",
        quote: "Sound engineering dedicated to the glory of the Most High.",
        scripture: "Psalm 150:5",
      },
      {
        id: "dg-usher",
        name: "Sis. Sarah Yetunde",
        role: "Ushering Coordinator",
        isCentral: false,
        department: "Pasture and Range Management",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&auto=format&fit=crop&q=80",
        quote: "Guiding worshippers with heavenly order and cheerful countenance.",
        scripture: "Romans 12:13",
      },
      {
        id: "dg-follow",
        name: "Bro. Gideon Ayodeji",
        role: "Follow up and Visitation Secretary",
        isCentral: false,
        department: "Animal Nutrition",
        image:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=700&auto=format&fit=crop&q=80",
        quote: "Seeking out every soul with faithful visits and warm fellowship.",
        scripture: "Ezekiel 34:16",
      },
      {
        id: "dg-acad",
        name: "Sis. Mary Ololade",
        role: "Academic Coordinator",
        isCentral: false,
        department: "Statistics",
        image:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&auto=format&fit=crop&q=80",
        quote: "Encouraging high academic standards as a true testimony for God.",
        scripture: "Colossians 3:17",
      },
    ],
  },
];
