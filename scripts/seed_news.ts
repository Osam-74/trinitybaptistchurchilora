import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnzJ1O4lggwDz8t8Wvx4kVxC-h3jMDjD8",
  authDomain: "trinity-baptist-church-ilora.firebaseapp.com",
  projectId: "trinity-baptist-church-ilora",
  storageBucket: "trinity-baptist-church-ilora.appspot.com",
  messagingSenderId: "201621492608",
  appId: "1:201621492608:web:7d46e3fe20fe1f7d6f4e62",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const img1 = "https://pub-2d440e1ef61e471c8b8f495fbe5a0298.r2.dev/session-files/news-events/1785048734902_pastor-anniversary-1.jpg";
const img2 = "https://pub-2d440e1ef61e471c8b8f495fbe5a0298.r2.dev/session-files/news-events/1785048738448_pastor-anniversary-2.jpg";
const img3 = "https://pub-2d440e1ef61e471c8b8f495fbe5a0298.r2.dev/session-files/news-events/1785048741602_pastor-family.jpg";

const now = new Date().toISOString();

const post = {
  title: "Celebrating 28 Years of Marriage: Rev. Dr. & Mrs. S. O. Mosebolatan",
  category: "celebration",
  excerpt: "Trinity Baptist Church, Ilora rejoices with our Senior Pastor, Rev. Dr. Solomon Olugbenga Mosebolatan, and his beloved wife as they celebrate 28 years of God's faithfulness in their marriage. We thank God for life, mercies, growth, and increase. May God continue to help your home.",
  body: [
    "It is with great joy and gratitude to God Almighty that Trinity Baptist Church, Ilora celebrates twenty-eight (28) glorious years of marriage with our Senior Pastor, Rev. Dr. Solomon Olugbenga Mosebolatan, and his beloved wife, Mrs. Mosebolatan.",
    "",
    "Twenty-eight years of marriage is no small milestone. It is a testament to the grace, faithfulness, and enduring love of God who has been the anchor of their home. Through seasons of joy and seasons of trial, through growth and change, they have remained steadfast in their commitment to one another and to the calling God placed on their lives.",
    "",
    "A MARRIAGE BUILT ON CHRIST",
    "",
    "Rev. Dr. Mosebolatan and his wife have modelled what it means to build a Christ-centred home. Their union has not only produced a beautiful family but has also been a source of inspiration and encouragement to the congregation and the wider community. They have shown us that when Christ is the foundation, love grows deeper with each passing year.",
    "",
    "WE THANK GOD",
    "",
    "We thank God for:",
    "- Life: for keeping them in good health and strength",
    "- Mercies: for His unfailing compassion and grace over their home",
    "- Growth: for how they have grown together in love, wisdom, and faith",
    "- Increase: for the fruit of their marriage and the lives they have touched",
    "",
    "A PRAYER FOR THE COUPLE",
    "",
    "As we celebrate this milestone, we pray that God Almighty will continue to strengthen their marriage, bless their home, and use them even more for His glory. May the Lord grant them many more years of joy, peace, and fruitful ministry together. May their love continue to be a shining light to all who know them.",
    "",
    "We, the Trinity Baptist Church family, are grateful for your leadership, your example, and your love for God's people. Happy 28th Wedding Anniversary, Papa and Mama!",
    "",
    "With love and prayers, Trinity Baptist Church, Ilora.",
  ].join("\n"),
  images: [img1, img2, img3],
  date: now,
  publishedAt: now,
  active: true,
  featured: true,
  author: "Trinity Baptist Church",
  tags: ["anniversary", "celebration", "marriage", "pastor"],
};

async function main() {
  // Note: Firestore rules require auth for writes.
  // This script uses the client SDK without auth — it will only work if
  // the rules allow unauthenticated writes, or you need to add auth.
  // As an alternative, we'll make the first news post via the admin UI after deploy.
  console.log("This seed script requires auth. Use the admin UI to create the first post.");
  console.log("Post data prepared — title:", post.title);
}

main();
