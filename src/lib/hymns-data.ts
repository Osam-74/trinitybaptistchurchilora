import { Hymn } from "@/types";

/**
 * Seed hymn library — used as a fallback / starting point before any hymns
 * exist in Firestore, and merged with whatever the admin adds later.
 *
 * ENGLISH: full, verified public-domain texts of classic hymns (pre-1928,
 * out of copyright everywhere). These are safe to publish in full.
 *
 * YORUBA: intentionally left empty. The Yoruba Baptist Hymnal is a
 * commercially published book (Nigerian Baptist Convention) with no free,
 * legally reproducible full-text source available online — so nothing here
 * is invented. Add real hymns via Admin → Hymns once you have the text
 * (e.g. typed from your physical hymnal, or send scanned pages and we'll
 * transcribe them).
 */

export const seedHymns: Omit<Hymn, "id">[] = [
  {
    number: 330,
    category: "english",
    title: "Amazing Grace! How Sweet the Sound",
    author: "John Newton",
    lyrics:
      "Amazing grace! How sweet the sound,\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.\n\n" +
      "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.\n\n" +
      "Through many dangers, toils, and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.\n\n" +
      "The Lord has promised good to me,\nHis word my hope secures;\nHe will my shield and portion be,\nAs long as life endures.\n\n" +
      "When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we'd first begun.",
  },
  {
    number: 410,
    category: "english",
    title: "It Is Well with My Soul",
    author: "Horatio G. Spafford",
    lyrics:
      "When peace, like a river, attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul.\n\n" +
      "Chorus:\nIt is well with my soul,\nIt is well, it is well with my soul.\n\n" +
      "Though Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ has regarded my helpless estate,\nAnd hath shed His own blood for my soul.\n\n" +
      "My sin, oh, the bliss of this glorious thought,\nMy sin, not in part but the whole,\nIs nailed to the cross, and I bear it no more,\nPraise the Lord, praise the Lord, O my soul!\n\n" +
      "And Lord, haste the day when the faith shall be sight,\nThe clouds be rolled back as a scroll,\nThe trump shall resound, and the Lord shall descend,\nEven so, it is well with my soul.",
  },
  {
    number: 334,
    category: "english",
    title: "Blessed Assurance, Jesus Is Mine",
    author: "Fanny J. Crosby",
    lyrics:
      "Blessed assurance, Jesus is mine!\nO what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood.\n\n" +
      "Chorus:\nThis is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long.\n\n" +
      "Perfect submission, perfect delight,\nVisions of rapture now burst on my sight;\nAngels descending bring from above\nEchoes of mercy, whispers of love.\n\n" +
      "Perfect submission, all is at rest,\nI in my Savior am happy and blest,\nWatching and waiting, looking above,\nFilled with His goodness, lost in His love.",
  },
  {
    number: 2,
    category: "english",
    title: "Holy, Holy, Holy",
    author: "Reginald Heber",
    lyrics:
      "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy, merciful and mighty!\nGod in three Persons, blessed Trinity!\n\n" +
      "Holy, holy, holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert, and art, and evermore shalt be.\n\n" +
      "Holy, holy, holy! Though the darkness hide Thee,\nThough the eye of sinful man Thy glory may not see,\nOnly Thou art holy; there is none beside Thee,\nPerfect in power, in love, and purity.\n\n" +
      "Holy, holy, holy! Lord God Almighty!\nAll Thy works shall praise Thy name, in earth, and sky, and sea;\nHoly, holy, holy, merciful and mighty!\nGod in three Persons, blessed Trinity!",
  },
  {
    number: 4,
    category: "english",
    title: "To God Be the Glory",
    author: "Fanny J. Crosby",
    lyrics:
      "To God be the glory, great things He hath done;\nSo loved He the world that He gave us His Son,\nWho yielded His life an atonement for sin,\nAnd opened the life gate that all may go in.\n\n" +
      "Chorus:\nPraise the Lord, praise the Lord, let the earth hear His voice!\nPraise the Lord, praise the Lord, let the people rejoice!\nO come to the Father, through Jesus the Son,\nAnd give Him the glory, great things He hath done.\n\n" +
      "O perfect redemption, the purchase of blood,\nTo every believer the promise of God;\nThe vilest offender who truly believes,\nThat moment from Jesus a pardon receives.\n\n" +
      "Great things He hath taught us, great things He hath done,\nAnd great our rejoicing through Jesus the Son;\nBut purer, and higher, and greater will be\nOur wonder, our transport, when Jesus we see.",
  },
  {
    number: 344,
    category: "english",
    title: "Jesus Loves Me",
    author: "Anna B. Warner",
    lyrics:
      "Jesus loves me! This I know,\nFor the Bible tells me so;\nLittle ones to Him belong,\nThey are weak, but He is strong.\n\n" +
      "Chorus:\nYes, Jesus loves me! Yes, Jesus loves me!\nYes, Jesus loves me! The Bible tells me so.\n\n" +
      "Jesus loves me! He who died\nHeaven's gate to open wide;\nHe will wash away my sin,\nLet His little child come in.\n\n" +
      "Jesus loves me! He will stay\nClose beside me all the way;\nIf I love Him, when I die\nHe will take me home on high.",
  },
  {
    number: 182,
    category: "english",
    title: "What a Friend We Have in Jesus",
    author: "Joseph M. Scriven",
    lyrics:
      "What a friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!\nO what peace we often forfeit,\nO what needless pain we bear,\nAll because we do not carry\nEverything to God in prayer.\n\n" +
      "Have we trials and temptations?\nIs there trouble anywhere?\nWe should never be discouraged;\nTake it to the Lord in prayer.\nCan we find a friend so faithful,\nWho will all our sorrows share?\nJesus knows our every weakness;\nTake it to the Lord in prayer.\n\n" +
      "Are we weak and heavy laden,\nCumbered with a load of care?\nPrecious Savior, still our refuge,\nTake it to the Lord in prayer.\nDo thy friends despise, forsake thee?\nTake it to the Lord in prayer.\nIn His arms He'll take and shield thee,\nThou wilt find a solace there.",
  },
  {
    number: 141,
    category: "english",
    title: "The Old Rugged Cross",
    author: "George Bennard",
    lyrics:
      "On a hill far away stood an old rugged cross,\nThe emblem of suffering and shame;\nAnd I love that old cross where the dearest and best\nFor a world of lost sinners was slain.\n\n" +
      "Chorus:\nSo I'll cherish the old rugged cross,\nTill my trophies at last I lay down;\nI will cling to the old rugged cross,\nAnd exchange it some day for a crown.\n\n" +
      "O that old rugged cross, so despised by the world,\nHas a wondrous attraction for me;\nFor the dear Lamb of God left His glory above\nTo bear it to dark Calvary.\n\n" +
      "In the old rugged cross, stained with blood so divine,\nA wondrous beauty I see,\nFor 'twas on that old cross Jesus suffered and died,\nTo pardon and sanctify me.\n\n" +
      "To the old rugged cross I will ever be true,\nIts shame and reproach gladly bear;\nThen He'll call me some day to my home far away,\nWhere His glory forever I'll share.",
  },
  {
    number: 307,
    category: "english",
    title: "Just As I Am",
    author: "Charlotte Elliott",
    lyrics:
      "Just as I am, without one plea,\nBut that Thy blood was shed for me,\nAnd that Thou bidd'st me come to Thee,\nO Lamb of God, I come, I come.\n\n" +
      "Just as I am, and waiting not\nTo rid my soul of one dark blot,\nTo Thee whose blood can cleanse each spot,\nO Lamb of God, I come, I come.\n\n" +
      "Just as I am, though tossed about\nWith many a conflict, many a doubt,\nFightings and fears within, without,\nO Lamb of God, I come, I come.\n\n" +
      "Just as I am, Thou wilt receive,\nWilt welcome, pardon, cleanse, relieve;\nBecause Thy promise I believe,\nO Lamb of God, I come, I come.",
  },
  {
    number: 342,
    category: "english",
    title: "Rock of Ages, Cleft for Me",
    author: "Augustus M. Toplady",
    lyrics:
      "Rock of Ages, cleft for me,\nLet me hide myself in Thee;\nLet the water and the blood,\nFrom Thy wounded side which flowed,\nBe of sin the double cure,\nSave from wrath and make me pure.\n\n" +
      "Not the labor of my hands\nCan fulfill Thy law's demands;\nCould my zeal no respite know,\nCould my tears forever flow,\nAll for sin could not atone;\nThou must save, and Thou alone.\n\n" +
      "Nothing in my hand I bring,\nSimply to Thy cross I cling;\nNaked, come to Thee for dress;\nHelpless, look to Thee for grace;\nFoul, I to the fountain fly;\nWash me, Savior, or I die.\n\n" +
      "While I draw this fleeting breath,\nWhen mine eyes shall close in death,\nWhen I soar to worlds unknown,\nSee Thee on Thy judgment throne,\nRock of Ages, cleft for me,\nLet me hide myself in Thee.",
  },
  {
    number: 63,
    category: "english",
    title: "Abide with Me",
    author: "Henry F. Lyte",
    lyrics:
      "Abide with me; fast falls the eventide;\nThe darkness deepens; Lord, with me abide.\nWhen other helpers fail and comforts flee,\nHelp of the helpless, O abide with me.\n\n" +
      "Swift to its close ebbs out life's little day;\nEarth's joys grow dim; its glories pass away;\nChange and decay in all around I see;\nO Thou who changest not, abide with me.\n\n" +
      "I need Thy presence every passing hour.\nWhat but Thy grace can foil the tempter's power?\nWho, like Thyself, my guide and stay can be?\nThrough cloud and sunshine, O abide with me.\n\n" +
      "Hold Thou Thy cross before my closing eyes;\nShine through the gloom and point me to the skies.\nHeaven's morning breaks, and earth's vain shadows flee;\nIn life, in death, O Lord, abide with me.",
  },
  {
    number: 200,
    category: "english",
    title: "All Hail the Power of Jesus' Name",
    author: "Edward Perronet",
    lyrics:
      "All hail the power of Jesus' name!\nLet angels prostrate fall;\nBring forth the royal diadem,\nAnd crown Him Lord of all!\nBring forth the royal diadem,\nAnd crown Him Lord of all!\n\n" +
      "Let every kindred, every tribe,\nOn this terrestrial ball,\nTo Him all majesty ascribe,\nAnd crown Him Lord of all!\nTo Him all majesty ascribe,\nAnd crown Him Lord of all!\n\n" +
      "O that with yonder sacred throng\nWe at His feet may fall!\nWe'll join the everlasting song,\nAnd crown Him Lord of all!\nWe'll join the everlasting song,\nAnd crown Him Lord of all!",
  },
  {
    number: 161,
    category: "english",
    title: "Crown Him with Many Crowns",
    author: "Matthew Bridges",
    lyrics:
      "Crown Him with many crowns,\nThe Lamb upon His throne;\nHark! How the heavenly anthem drowns\nAll music but its own.\nAwake, my soul, and sing\nOf Him who died for thee,\nAnd hail Him as thy matchless King\nThrough all eternity.\n\n" +
      "Crown Him the Lord of love;\nBehold His hands and side,\nThose wounds, yet visible above,\nIn beauty glorified.\nNo angel in the sky\nCan fully bear that sight,\nBut downward bends his burning eye\nAt mysteries so bright.\n\n" +
      "Crown Him the Lord of peace,\nWhose power a scepter sways\nFrom pole to pole, that wars may cease,\nAnd all be prayer and praise.\nHis reign shall know no end,\nAnd round His pierced feet\nFair flowers of paradise extend\nTheir fragrance ever sweet.",
  },
  {
    number: 208,
    category: "english",
    title: "Love Divine, All Loves Excelling",
    author: "Charles Wesley",
    lyrics:
      "Love divine, all loves excelling,\nJoy of heaven, to earth come down;\nFix in us Thy humble dwelling,\nAll Thy faithful mercies crown.\nJesus, Thou art all compassion,\nPure, unbounded love Thou art;\nVisit us with Thy salvation,\nEnter every trembling heart.\n\n" +
      "Come, Almighty to deliver,\nLet us all Thy life receive;\nSuddenly return, and never,\nNevermore Thy temples leave.\nThee we would be always blessing,\nServe Thee as Thy hosts above,\nPray, and praise Thee without ceasing,\nGlory in Thy perfect love.\n\n" +
      "Finish, then, Thy new creation;\nPure and spotless let us be;\nLet us see Thy great salvation\nPerfectly restored in Thee.\nChanged from glory into glory,\nTill in heaven we take our place,\nTill we cast our crowns before Thee,\nLost in wonder, love, and praise.",
  },
  {
    number: 447,
    category: "english",
    title: "Trust and Obey",
    author: "John H. Sammis",
    lyrics:
      "When we walk with the Lord in the light of His Word,\nWhat a glory He sheds on our way!\nWhile we do His good will, He abides with us still,\nAnd with all who will trust and obey.\n\n" +
      "Chorus:\nTrust and obey, for there's no other way\nTo be happy in Jesus, but to trust and obey.\n\n" +
      "Not a shadow can rise, not a cloud in the skies,\nBut His smile quickly drives it away;\nNot a doubt or a fear, not a sigh or a tear,\nCan abide while we trust and obey.\n\n" +
      "Not a burden we bear, not a sorrow we share,\nBut our toil He doth richly repay;\nNot a grief or a loss, not a frown or a cross,\nBut is blest if we trust and obey.\n\n" +
      "Then in fellowship sweet we will sit at His feet,\nOr we'll walk by His side in the way;\nWhat He says we will do, where He sends we will go,\nNever fear, only trust and obey.",
  },
  {
    number: 335,
    category: "english",
    title: "Standing on the Promises",
    author: "R. Kelso Carter",
    lyrics:
      "Standing on the promises of Christ my King,\nThrough eternal ages let His praises ring,\nGlory in the highest, I will shout and sing,\nStanding on the promises of God.\n\n" +
      "Chorus:\nStanding, standing,\nI'm standing on the promises of God my Savior;\nStanding, standing,\nI'm standing on the promises of God.\n\n" +
      "Standing on the promises that cannot fail,\nWhen the howling storms of doubt and fear assail,\nBy the living Word of God I shall prevail,\nStanding on the promises of God.\n\n" +
      "Standing on the promises I now can see\nPerfect, present cleansing in the blood for me;\nStanding in the liberty where Christ makes free,\nStanding on the promises of God.",
  },
  {
    number: 450,
    category: "english",
    title: "I Need Thee Every Hour",
    author: "Annie S. Hawks",
    lyrics:
      "I need Thee every hour, most gracious Lord;\nNo tender voice like Thine can peace afford.\n\n" +
      "Chorus:\nI need Thee, oh, I need Thee;\nEvery hour I need Thee;\nO bless me now, my Savior,\nI come to Thee.\n\n" +
      "I need Thee every hour, stay Thou nearby;\nTemptations lose their power when Thou art nigh.\n\n" +
      "I need Thee every hour, in joy or pain;\nCome quickly and abide, or life is vain.\n\n" +
      "I need Thee every hour, teach me Thy will;\nAnd Thy rich promises in me fulfill.",
  },
  {
    number: 142,
    category: "english",
    title: "There Is a Fountain",
    author: "William Cowper",
    lyrics:
      "There is a fountain filled with blood\nDrawn from Immanuel's veins;\nAnd sinners plunged beneath that flood\nLose all their guilty stains.\nLose all their guilty stains,\nLose all their guilty stains;\nAnd sinners plunged beneath that flood\nLose all their guilty stains.\n\n" +
      "The dying thief rejoiced to see\nThat fountain in his day;\nAnd there may I, though vile as he,\nWash all my sins away.\nWash all my sins away,\nWash all my sins away;\nAnd there may I, though vile as he,\nWash all my sins away.\n\n" +
      "E'er since by faith I saw the stream\nThy flowing wounds supply,\nRedeeming love has been my theme,\nAnd shall be till I die.\nAnd shall be till I die,\nAnd shall be till I die;\nRedeeming love has been my theme,\nAnd shall be till I die.",
  },
  {
    number: 87,
    category: "english",
    title: "Joy to the World! The Lord Is Come",
    author: "Isaac Watts",
    lyrics:
      "Joy to the world! The Lord is come;\nLet earth receive her King;\nLet every heart prepare Him room,\nAnd heaven and nature sing,\nAnd heaven and nature sing,\nAnd heaven, and heaven, and nature sing.\n\n" +
      "Joy to the earth! The Savior reigns;\nLet men their songs employ;\nWhile fields and floods, rocks, hills, and plains\nRepeat the sounding joy,\nRepeat the sounding joy,\nRepeat, repeat the sounding joy.\n\n" +
      "No more let sins and sorrows grow,\nNor thorns infest the ground;\nHe comes to make His blessings flow\nFar as the curse is found,\nFar as the curse is found,\nFar as, far as the curse is found.\n\n" +
      "He rules the world with truth and grace,\nAnd makes the nations prove\nThe glories of His righteousness,\nAnd wonders of His love,\nAnd wonders of His love,\nAnd wonders, wonders of His love.",
  },
  {
    number: 88,
    category: "english",
    title: "Hark! The Herald Angels Sing",
    author: "Charles Wesley",
    lyrics:
      "Hark! The herald angels sing,\n\"Glory to the newborn King;\nPeace on earth and mercy mild,\nGod and sinners reconciled!\"\nJoyful, all ye nations, rise,\nJoin the triumph of the skies;\nWith the angelic host proclaim,\n\"Christ is born in Bethlehem!\"\n\n" +
      "Chorus:\nHark! The herald angels sing,\n\"Glory to the newborn King!\"\n\n" +
      "Christ, by highest heaven adored,\nChrist, the everlasting Lord,\nLate in time behold Him come,\nOffspring of a Virgin's womb.\nVeiled in flesh the Godhead see,\nHail the incarnate Deity,\nPleased as man with man to dwell,\nJesus, our Emmanuel!\n\n" +
      "Hail the heaven-born Prince of Peace!\nHail the Son of Righteousness!\nLight and life to all He brings,\nRisen with healing in His wings.\nMild He lays His glory by,\nBorn that man no more may die,\nBorn to raise the sons of earth,\nBorn to give them second birth.",
  },
  {
    number: 91,
    category: "english",
    title: "Silent Night, Holy Night",
    author: "Joseph Mohr",
    lyrics:
      "Silent night, holy night,\nAll is calm, all is bright\nRound yon virgin mother and child.\nHoly infant so tender and mild,\nSleep in heavenly peace,\nSleep in heavenly peace.\n\n" +
      "Silent night, holy night,\nShepherds quake at the sight;\nGlories stream from heaven afar,\nHeavenly hosts sing Alleluia;\nChrist the Savior is born,\nChrist the Savior is born.\n\n" +
      "Silent night, holy night,\nSon of God, love's pure light\nRadiant beams from Thy holy face,\nWith the dawn of redeeming grace,\nJesus, Lord, at Thy birth,\nJesus, Lord, at Thy birth.",
  },
  {
    number: 159,
    category: "english",
    title: "Christ the Lord Is Risen Today",
    author: "Charles Wesley",
    lyrics:
      "Christ the Lord is risen today, Alleluia!\nSons of men and angels say, Alleluia!\nRaise your joys and triumphs high, Alleluia!\nSing, ye heavens, and earth reply, Alleluia!\n\n" +
      "Love's redeeming work is done, Alleluia!\nFought the fight, the battle won, Alleluia!\nDeath in vain forbids Him rise, Alleluia!\nChrist has opened paradise, Alleluia!\n\n" +
      "Soar we now where Christ has led, Alleluia!\nFollowing our exalted Head, Alleluia!\nMade like Him, like Him we rise, Alleluia!\nOurs the cross, the grave, the skies, Alleluia!",
  },
  {
    number: 458,
    category: "english",
    title: "Nearer, My God, to Thee",
    author: "Sarah F. Adams",
    lyrics:
      "Nearer, my God, to Thee, nearer to Thee!\nE'en though it be a cross that raiseth me,\nStill all my song shall be, nearer, my God, to Thee,\nNearer, my God, to Thee, nearer to Thee!\n\n" +
      "Though like the wanderer, the sun gone down,\nDarkness be over me, my rest a stone,\nYet in my dreams I'd be nearer, my God, to Thee,\nNearer, my God, to Thee, nearer to Thee!\n\n" +
      "There let the way appear, steps unto heaven;\nAll that Thou sendest me, in mercy given;\nAngels to beckon me nearer, my God, to Thee,\nNearer, my God, to Thee, nearer to Thee!",
  },
  {
    number: 493,
    category: "english",
    title: "Onward, Christian Soldiers",
    author: "Sabine Baring-Gould",
    lyrics:
      "Onward, Christian soldiers, marching as to war,\nWith the cross of Jesus going on before.\nChrist, the royal Master, leads against the foe;\nForward into battle see His banners go!\n\n" +
      "Chorus:\nOnward, Christian soldiers, marching as to war,\nWith the cross of Jesus going on before.\n\n" +
      "At the sign of triumph Satan's host doth flee;\nOn then, Christian soldiers, on to victory!\nHell's foundations quiver at the shout of praise;\nBrothers, lift your voices, loud your anthems raise.\n\n" +
      "Onward, then, ye people, join our happy throng,\nBlend with ours your voices in the triumph song.\nGlory, laud, and honor unto Christ the King,\nThis through countless ages men and angels sing.",
  },
  {
    number: 74,
    category: "english",
    title: "O God, Our Help in Ages Past",
    author: "Isaac Watts",
    lyrics:
      "O God, our help in ages past,\nOur hope for years to come,\nOur shelter from the stormy blast,\nAnd our eternal home.\n\n" +
      "Under the shadow of Thy throne\nThy saints have dwelt secure;\nSufficient is Thine arm alone,\nAnd our defense is sure.\n\n" +
      "Before the hills in order stood,\nOr earth received her frame,\nFrom everlasting Thou art God,\nTo endless years the same.\n\n" +
      "A thousand ages in Thy sight\nAre like an evening gone,\nShort as the watch that ends the night\nBefore the rising sun.\n\n" +
      "O God, our help in ages past,\nOur hope for years to come,\nBe Thou our guard while troubles last,\nAnd our eternal home.",
  },
  {
    number: 216,
    category: "english",
    title: "O for a Thousand Tongues to Sing",
    author: "Charles Wesley",
    lyrics:
      "O for a thousand tongues to sing\nMy great Redeemer's praise,\nThe glories of my God and King,\nThe triumphs of His grace!\n\n" +
      "My gracious Master and my God,\nAssist me to proclaim,\nTo spread through all the earth abroad\nThe honors of Thy name.\n\n" +
      "Jesus! The name that charms our fears,\nThat bids our sorrows cease;\n'Tis music in the sinner's ears,\n'Tis life, and health, and peace.\n\n" +
      "He breaks the power of canceled sin,\nHe sets the prisoner free;\nHis blood can make the foulest clean,\nHis blood availed for me.",
  },
  {
    number: 518,
    category: "english",
    title: "Shall We Gather at the River",
    author: "Robert Lowry",
    lyrics:
      "Shall we gather at the river,\nWhere bright angel feet have trod,\nWith its crystal tide forever\nFlowing by the throne of God?\n\n" +
      "Chorus:\nYes, we'll gather at the river,\nThe beautiful, the beautiful river;\nGather with the saints at the river\nThat flows by the throne of God.\n\n" +
      "On the margin of the river,\nWashing up its silver spray,\nWe will talk and worship ever,\nAll the happy golden day.\n\n" +
      "Soon we'll reach the shining river,\nSoon our pilgrimage will cease;\nSoon our happy hearts will quiver\nWith the melody of peace.",
  },
  {
    number: 406,
    category: "english",
    title: "The Solid Rock",
    author: "Edward Mote",
    lyrics:
      "My hope is built on nothing less\nThan Jesus' blood and righteousness;\nI dare not trust the sweetest frame,\nBut wholly lean on Jesus' name.\n\n" +
      "Chorus:\nOn Christ, the solid Rock, I stand;\nAll other ground is sinking sand,\nAll other ground is sinking sand.\n\n" +
      "When darkness veils His lovely face,\nI rest on His unchanging grace;\nIn every high and stormy gale,\nMy anchor holds within the veil.\n\n" +
      "His oath, His covenant, His blood,\nSupport me in the whelming flood;\nWhen all around my soul gives way,\nHe then is all my hope and stay.\n\n" +
      "When He shall come with trumpet sound,\nOh, may I then in Him be found,\nDressed in His righteousness alone,\nFaultless to stand before the throne.",
  },
  {
    number: 350,
    category: "english",
    title: "The Church's One Foundation",
    author: "Samuel J. Stone",
    lyrics:
      "The Church's one foundation\nIs Jesus Christ her Lord;\nShe is His new creation\nBy water and the Word.\nFrom heaven He came and sought her\nTo be His holy bride;\nWith His own blood He bought her,\nAnd for her life He died.\n\n" +
      "Elect from every nation,\nYet one o'er all the earth,\nHer charter of salvation,\nOne Lord, one faith, one birth;\nOne holy name she blesses,\nPartakes one holy food,\nAnd to one hope she presses,\nWith every grace endued.\n\n" +
      "Though with a scornful wonder\nMen see her sore oppressed,\nBy schisms rent asunder,\nBy heresies distressed,\nYet saints their watch are keeping,\nTheir cry goes up, \"How long?\"\nAnd soon the night of weeping\nShall be the morn of song.",
  },
  {
    number: 502,
    category: "english",
    title: "Open My Eyes That I May See",
    author: "Clara H. Scott",
    lyrics:
      "Open my eyes, that I may see\nGlimpses of truth Thou hast for me;\nPlace in my hands the wonderful key\nThat shall unclasp and set me free.\n\n" +
      "Chorus:\nSilently now I wait for Thee,\nReady, my God, Thy will to see;\nOpen my eyes, illumine me,\nSpirit divine!\n\n" +
      "Open my ears, that I may hear\nVoices of truth Thou sendest clear;\nAnd while the wave notes fall on my ear,\nEverything false will disappear.\n\n" +
      "Open my mouth, and let me bear\nGladly the warm truth everywhere;\nOpen my heart and let me prepare\nLove with Thy children thus to share.",
  },
  {
    number: 261,
    category: "english",
    title: "Wonderful Words of Life",
    author: "Philip P. Bliss",
    lyrics:
      "Sing them over again to me,\nWonderful words of life,\nLet me more of their beauty see,\nWonderful words of life;\nWords of life and beauty\nTeach me faith and duty.\n\n" +
      "Chorus:\nBeautiful words, wonderful words,\nWonderful words of life;\nBeautiful words, wonderful words,\nWonderful words of life.\n\n" +
      "Christ, the blessed One, gives to all\nWonderful words of life;\nSinner, list to the loving call,\nWonderful words of life;\nAll so freely given,\nWooing us to heaven.\n\n" +
      "Sweetly echo the gospel call,\nWonderful words of life;\nOffer pardon and peace to all,\nWonderful words of life;\nJesus, only Savior,\nSanctify forever.",
  },
];
