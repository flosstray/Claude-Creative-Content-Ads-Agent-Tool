import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
  ShadingType, TableLayoutType, convertInchesToTwip
} from "docx";
import fs from "fs";

// Brand colors
const DARK = "1A1A2E";
const BLUE = "2563EB";
const GRAY = "6B7280";
const LIGHT_BG = "F3F4F6";
const WHITE = "FFFFFF";

// Helpers
const spacer = (pts = 6) => new Paragraph({ spacing: { after: pts * 20 } });

const title = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({ heading: level, spacing: { before: 200, after: 100 }, children: [new TextRun({ text, bold: true, color: DARK })] });

const subtitle = (text) =>
  new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text, bold: true, color: BLUE })] });

const h3 = (text) =>
  new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 120, after: 60 }, children: [new TextRun({ text, bold: true, color: DARK })] });

const para = (text) =>
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, size: 22, color: "333333" })] });

const boldPara = (label, value) =>
  new Paragraph({ spacing: { after: 80 }, children: [
    new TextRun({ text: label, bold: true, size: 22, color: DARK }),
    new TextRun({ text: value, size: 22, color: "333333" })
  ]});

const bullet = (text) =>
  new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text, size: 22, color: "333333" })] });

const numberedItem = (num, text) =>
  new Paragraph({ spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.3) }, children: [
    new TextRun({ text: `${num}. `, bold: true, size: 22, color: BLUE }),
    new TextRun({ text, size: 22, color: "333333" })
  ]});

// Table builder
function makeTable(headers, rows) {
  const headerCells = headers.map(h =>
    new TableCell({
      shading: { type: ShadingType.SOLID, color: DARK },
      children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: h, bold: true, size: 20, color: WHITE })] })],
      width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE }
    })
  );
  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map(cell =>
        new TableCell({
          shading: ri % 2 === 0 ? { type: ShadingType.SOLID, color: LIGHT_BG } : undefined,
          children: [new Paragraph({ children: [new TextRun({ text: String(cell), size: 20, color: "333333" })] })],
          width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE }
        })
      )
    })
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [new TableRow({ children: headerCells }), ...dataRows]
  });
}

// ---------- BUILD DOCUMENT ----------
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } }
    }
  },
  sections: [
    // ===== TITLE PAGE =====
    {
      children: [
        spacer(120),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "HIT HERO", size: 72, bold: true, color: DARK, font: "Calibri" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
          new TextRun({ text: "Meta Ads Creative Framework", size: 40, color: BLUE, font: "Calibri" })
        ]}),
        spacer(20),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
          new TextRun({ text: "3 Angles  x  3 Formats  |  Ad Copy & Creative Briefs", size: 24, color: GRAY })
        ]}),
        spacer(40),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "March 17, 2026", size: 24, color: GRAY })
        ]}),
      ]
    },

    // ===== STRUCTURE =====
    {
      children: [
        title("Framework Structure"),
        boldPara("Product: ", "Hit Hero Baseball Thumb Guard"),
        spacer(8),
        para("ANGLE 1: The Invisible Distraction (Mental Focus)"),
        bullet("F1: Static Image"),
        bullet("F2: Short Video / UGC (15s)"),
        bullet("F3: Carousel"),
        spacer(4),
        para("ANGLE 2: Credibility / Legitimacy (Social Proof)"),
        bullet("F1: Static Image"),
        bullet("F2: Short Video / UGC (15s)"),
        bullet("F3: Carousel"),
        spacer(4),
        para("ANGLE 3: The Skeptic Converter (Objection Handling)"),
        bullet("F1: Static Image"),
        bullet("F2: Short Video / UGC (15s)"),
        bullet("F3: Carousel"),

        // ===== ANGLE 1 =====
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        title("ANGLE 1: THE INVISIBLE DISTRACTION"),
        boldPara("Territory: ", "Mental focus / performance"),
        boldPara("Core insight: ", "Bat sting and thumb discomfort steal mental bandwidth at the exact moment you should be reading the pitch. Hit Hero removes the distraction you didn't realize was costing you."),
        boldPara("Primary audience: ", "Competitive and travel ball players (12-34)"),
        boldPara("Tone: ", "Direct, performance-minded, zero fluff"),

        // F1
        subtitle("F1: Static Image"),
        h3("Creative Brief"),
        bullet("Visual: Close-up of a hitter's hands on a bat with Hit Hero on the thumb. Background blurred (shallow depth of field). Clean, dark, editorial feel."),
        bullet("Key message: Your best at-bats happen when your hands aren't on your mind."),
        bullet("Viewer should feel: Recognition that distraction at the plate costs them."),
        spacer(4),
        h3("Variant A"),
        makeTable(["Element", "Copy", "Chars"], [
          ["Headline", "Your hands shouldn't be a distraction", "38"],
          ["Primary text", "The best at-bats start when you stop thinking about your grip.", "63"],
          ["CTA", "See why 20,000+ players made the switch", "40"]
        ]),
        spacer(6),
        h3("Variant B"),
        makeTable(["Element", "Copy", "Chars"], [
          ["Headline", "One less thing on your mind", "26"],
          ["Primary text", "You can't read a pitch and worry about your hands at the same time.", "67"],
          ["CTA", "Feel the difference on your first swing", "39"]
        ]),

        // F2
        subtitle("F2: Short Video / UGC (15s)"),
        h3("Creative Brief"),
        bullet("Format: Split-screen or quick-cut UGC from a real player"),
        bullet('Seconds 0-3 (HOOK): Player at the plate. Text overlay: "What\'s actually costing you at the plate?"'),
        bullet('Seconds 3-8: Player talking direct to camera. "I used to step in thinking about my hands. Whether I was going to get jammed, whether my grip felt right. That\'s over."'),
        bullet("Seconds 8-12: Quick cuts of swings, close-up of Hit Hero on hand, contact shots."),
        bullet("Seconds 12-15: Product shot + CTA overlay."),
        bullet("Pacing: Fast. No music bed necessary. Natural audio preferred."),
        bullet("Key message: The distraction you don't realize you have is the one that costs you most."),
        spacer(4),
        h3("Hook Variants to Test"),
        numberedItem(1, '"What\'s actually costing you at the plate?" (curiosity)'),
        numberedItem(2, '"I didn\'t realize how much I was thinking about my hands until I stopped." (insight)'),
        numberedItem(3, '"Best hitters aren\'t thinking about their grip." (identity/aspiration)'),
        numberedItem(4, '"The at-bat starts before the pitch. Here\'s what most hitters miss." (contrarian)'),
        numberedItem(5, '"This changed how I step into the box." (personal transformation)'),
        spacer(4),
        boldPara("Variant A primary text: ", '"You can\'t track a pitch and think about your hands at the same time. 20,000+ hitters figured that out." (91 chars)'),
        boldPara("Variant B primary text: ", '"The best at-bats happen when your hands disappear. That\'s the whole point." (75 chars)'),

        // F3
        subtitle("F3: Carousel (4 frames)"),
        h3("Creative Brief"),
        bullet("Visual style: Dark, clean, minimal text per frame. Each frame lands one beat of the argument."),
        bullet('Frame 1: "What are you thinking about at the plate?" (bold text, dark background, silhouette of hitter)'),
        bullet('Frame 2: "If the answer includes your hands, that\'s a problem." (close-up of bare grip)'),
        bullet('Frame 3: "Hit Hero removes the noise. Natural feel. No bulk. Nothing to think about." (product on hand)'),
        bullet('Frame 4: "20,000+ hitters. One less distraction." (product lineup + CTA button)'),
        bullet("Viewer should feel: A slow build from self-recognition to resolution."),
        spacer(4),
        boldPara("Headline: ", "Stop thinking. Start hitting. (28 chars)"),
        boldPara("Variant A: ", '"Your grip shouldn\'t take up headspace. Hit Hero feels like nothing, and that\'s the point." (90 chars)'),
        boldPara("Variant B: ", '"The hitters who perform don\'t think about their hands. Now you know why." (72 chars)'),

        // ===== ANGLE 2 =====
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        title("ANGLE 2: CREDIBILITY / LEGITIMACY"),
        boldPara("Territory: ", "Social proof and trust-building"),
        boldPara("Core insight: ", "This isn't a garage experiment. Hit Hero is on the field from Little League to the highest levels of pro ball. The rule change, the distribution deal, and the volume tell the story."),
        boldPara("Primary audience: ", "All three segments (trust is a universal barrier)"),
        boldPara("Tone: ", "Confident, understated, authoritative"),

        // F1
        subtitle("F1: Static Image"),
        h3("Creative Brief"),
        bullet("Visual: Product laid on a dugout bench or in a bat bag alongside pro-level gear. The environment does the credibility work. No logos needed. The setting implies the level."),
        bullet("Key message: It's already on the field at every level."),
        bullet('Viewer should feel: "This is legit. Real players use this."'),
        spacer(4),
        h3("Variant A"),
        makeTable(["Element", "Copy", "Chars"], [
          ["Headline", "From Little League to the pros", "30"],
          ["Primary text", "Now legal in Little League. Already trusted at the highest level. 20,000+ sold.", "80"],
          ["CTA", "Shop Hit Hero", "13"]
        ]),
        spacer(6),
        h3("Variant B"),
        makeTable(["Element", "Copy", "Chars"], [
          ["Headline", "20,000+ units. Every level.", "27"],
          ["Primary text", "Little League approved. Pro-level trusted. Global distribution through Markwort.", "80"],
          ["CTA", "See all 12 colors", "17"]
        ]),

        // F2
        subtitle("F2: Short Video / UGC (15s)"),
        h3("Creative Brief"),
        bullet("Format: Founder-led or montage with text overlays"),
        bullet('Seconds 0-3 (HOOK): Quick montage of Hit Hero on hands across different levels of play. Text: "Where you\'ll find Hit Hero."'),
        bullet('Seconds 3-10: Quick cuts across levels. Text overlays: "Little League legal" / "Pro-level tested" / "20,000+ units sold" / "Global distribution via Markwort" / "12 colors"'),
        bullet("Seconds 10-15: Product array shot or founder holding the product. CTA overlay."),
        bullet("Pacing: Confident, not rushed. Let each proof point land for ~1.5 seconds."),
        spacer(4),
        h3("Hook Variants"),
        numberedItem(1, '"Where you\'ll find Hit Hero." (authority, visual-led)'),
        numberedItem(2, '"There\'s a reason it\'s at every level." (implied proof)'),
        numberedItem(3, '"Little League just made it legal. The pros already knew." (news hook + credibility)'),
        numberedItem(4, '"20,000 hitters can\'t all be wrong." (social proof volume)'),
        numberedItem(5, '"From travel ball to the show. Same thumb guard." (range)'),
        spacer(4),
        boldPara("Variant A: ", '"Little League legal. Pro-level trusted. 20,000+ hitters already know." (70 chars)'),
        boldPara("Variant B: ", '"It\'s on the field at every level. There\'s a reason for that." (61 chars)'),

        // F3
        subtitle("F3: Carousel (4 frames)"),
        h3("Creative Brief"),
        bullet('Frame 1: "Where is Hit Hero?" (bold text, dark background)'),
        bullet('Frame 2: Youth/travel ball setting + "Little League. Now officially legal."'),
        bullet('Frame 3: College or high-level setting + "Pro-level tested. Trusted at the top."'),
        bullet('Frame 4: Product lineup (12 colors) + "20,000+ sold. Distributed globally by Markwort."'),
        bullet("Viewer should feel: Escalating credibility. Each swipe builds trust."),
        spacer(4),
        boldPara("Headline: ", "Trusted at every level (21 chars)"),
        boldPara("Variant A: ", '"Little League approved. Pro tested. 20,000+ hitters and counting." (65 chars)'),
        boldPara("Variant B: ", '"The rule change made it official. The players already knew." (59 chars)'),

        // ===== ANGLE 3 =====
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        title("ANGLE 3: THE SKEPTIC CONVERTER"),
        boldPara("Territory: ", "Overcoming objections / earned trust"),
        boldPara("Core insight: ", "This audience has been burned. Tape, gloves, grips, playing through it. They're not looking for promises. They're looking for something that actually feels different the moment they put it on."),
        boldPara("Primary audience: ", "Adult rec players, competitive players, skeptical parents"),
        boldPara("Tone: ", "Self-aware, honest, slightly disarming"),

        // F1
        subtitle("F1: Static Image"),
        h3("Creative Brief"),
        bullet('Visual: Flat lay of Hit Hero next to the "graveyard" of alternatives: roll of tape, worn batting glove, generic grip sleeve, all looking used and tired. Hit Hero sits clean and distinct.'),
        bullet("Key message: You've tried everything else. This one's different."),
        bullet('Viewer should feel: Seen. "Yeah, I\'ve been through all that."'),
        spacer(4),
        h3("Variant A"),
        makeTable(["Element", "Copy", "Chars"], [
          ["Headline", "You've tried everything else", "28"],
          ["Primary text", "Tape. Gloves. New bat. Playing through it. Hit Hero is the one that actually works.", "83"],
          ["CTA", "Try it risk-free", "16"]
        ]),
        spacer(6),
        h3("Variant B"),
        makeTable(["Element", "Copy", "Chars"], [
          ["Headline", "Different the second you grip it", "31"],
          ["Primary text", "No bulk. No break-in. You'll know it works before your first swing is over.", "75"],
          ["CTA", "Feel the difference", "19"]
        ]),

        // F2
        subtitle("F2: Short Video / UGC (15s)"),
        h3("Creative Brief"),
        bullet("Format: Authentic UGC. Real player, real setting, talking directly to camera."),
        bullet('Seconds 0-3 (HOOK): Player holds up Hit Hero. "I\'m going to be honest. I didn\'t think this would work."'),
        bullet('Seconds 3-10: "I\'ve tried tape. Extra batting gloves. Different grips. All of it felt off. I put this on and the first swing, I could tell. It just feels right. No bulk. Nothing weird. Just... right."'),
        bullet("Seconds 10-15: Swings. Contact. Close-up of product on hand. CTA overlay."),
        bullet("Pacing: Conversational. Not scripted-feeling. Pauses are fine."),
        bullet("Key message: Let the skepticism play out, then let the product's feel resolve it."),
        spacer(4),
        h3("Hook Variants"),
        numberedItem(1, '"I\'m going to be honest. I didn\'t think this would work." (vulnerability/relatability)'),
        numberedItem(2, '"I\'ve tried every grip product out there. This is the only one I kept using." (experience)'),
        numberedItem(3, '"If you\'re skeptical, good. I was too." (disarming)'),
        numberedItem(4, '"Tape, gloves, new bats. None of it fixed it. This did." (failed alternatives)'),
        numberedItem(5, '"The first swing told me everything I needed to know." (outcome tease)'),
        spacer(4),
        boldPara("Variant A: ", '"Skeptical? Good. Put it on and take one swing. That\'s all it takes." (67 chars)'),
        boldPara("Variant B: ", '"Tape didn\'t work. Extra gloves didn\'t work. This did. First swing." (66 chars)'),

        // F3
        subtitle("F3: Carousel (5 frames)"),
        h3("Creative Brief"),
        bullet('Frame 1: "Sound familiar?" (bold, dark)'),
        bullet('Frame 2: Taped-up hand. "Tape. Falls off. Feels weird. Never consistent."'),
        bullet('Frame 3: Stacked batting gloves. "Extra gloves. Still doesn\'t stop thumb jams."'),
        bullet('Frame 4: Expensive bat. "New bat. $400 later. Same sting."'),
        bullet('Frame 5: Hit Hero product shot. "Hit Hero. Feels natural. Stops the sting. You\'ll know the first swing."'),
        bullet('Viewer should feel: "They get it. They\'ve been where I am." Then: "Maybe this one is actually different."'),
        spacer(4),
        boldPara("Headline: ", "The one that actually works (27 chars)"),
        boldPara("Variant A: ", '"You\'ve tried the rest. Tape, gloves, playing through it. Hit Hero is different on the first swing." (99 chars)'),
        boldPara("Variant B: ", '"We\'re not going to over-promise. Put it on. Take a swing. You\'ll get it." (73 chars)'),

        // ===== AUDIENCE TARGETING =====
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        title("AUDIENCE TARGETING MAP"),
        makeTable(
          ["Angle", "Best For", "Meta Targeting Notes"],
          [
            ["Angle 1: Invisible Distraction", "Competitive/travel ball players 12-34", "Interest: baseball training, travel baseball, Perfect Game, USSSA. Broad with creative doing the targeting."],
            ["Angle 2: Credibility", "All three audiences", "Broadest reach. Use as top-of-funnel to build trust. Retarget engagers with Angle 1 or 3."],
            ["Angle 3: Skeptic Converter", "Adult rec players, skeptical parents 35-50", "Interest: adult baseball leagues, Little League parents, baseball gear. Also strong as retargeting for anyone who viewed but didn't buy."]
          ]
        ),

        // ===== TESTING PLAN =====
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        title("TESTING PLAN (Hormozi Volume Method)"),

        h3("Week 1-2: Hook Testing"),
        bullet("Record 5+ hook openings for each Angle's F2 video (15 total hooks minimum)"),
        bullet("Run all hooks with same body content"),
        bullet("Kill losers at Day 3-5. Scale winners immediately."),

        h3("Week 2-3: Format Testing"),
        bullet("For each winning angle, test F1 vs F2 vs F3"),
        bullet("Identify which format drives lowest CPL per angle"),

        h3("Week 3-4: Scale Winners"),
        bullet("Take top 2-3 performing angle/format combos"),
        bullet("Create 5 more hook variations of each winner"),
        bullet("Increase budget 20-25% every 48 hours on winners"),
        bullet("Duplicate winners into retargeting ad sets"),

        h3("Ongoing: 70-20-10 Allocation"),
        bullet("70% spend on proven winners (refresh hooks monthly)"),
        bullet("20% on variations of winners (new proof, new player, new setting)"),
        bullet("10% experimental (new angles, new formats, seasonal hooks like tournament season or Little League rule change news)"),

        // ===== MEDIA UPLOAD & VIDEO ANALYSIS =====
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        title("MEDIA UPLOAD & VIDEO ANALYSIS"),
        para("Paste a video link below. The system will fetch the video, analyze its content, and return a structured breakdown including a full visual description and transcription."),

        subtitle("How to Submit"),
        makeTable(
          ["Source", "How to Share", "Notes"],
          [
            ["Instagram Reel/Post", "Paste the full post URL (e.g. instagram.com/reel/abc123)", "Public posts only. Private accounts require screen recording or local file."],
            ["Google Drive", "Paste the sharing link. Set permissions to 'Anyone with the link can view'.", "Supports MP4, MOV, and most standard video formats."],
            ["YouTube", "Paste the full video URL or short link (youtu.be/...)", "Works for public and unlisted videos."],
            ["TikTok", "Paste the full video URL", "Public videos only."],
            ["Local file", "Provide the file path on your machine", "MP4, MOV, WebM supported."]
          ]
        ),

        subtitle("What You Get Back"),
        para("For every video submitted, the system returns:"),
        spacer(4),

        h3("1. Visual Description"),
        bullet("Scene-by-scene breakdown of what's on screen"),
        bullet("Setting, lighting, framing, and camera movement notes"),
        bullet("On-screen text and graphics captured in order of appearance"),
        bullet("Product visibility: when, where, and how the product appears"),
        bullet("Talent description: who's on screen, what they're doing, body language"),
        spacer(4),

        h3("2. Transcription"),
        bullet("Full spoken-word transcript with timestamps"),
        bullet("Speaker identification (if multiple people)"),
        bullet("On-screen text overlays captured separately from spoken audio"),
        bullet("Music or sound effects noted where relevant"),
        spacer(4),

        h3("3. Framework Analysis"),
        para("Each video is scored against the Hit Hero creative framework:"),
        spacer(4),
        makeTable(
          ["Analysis Layer", "Output"],
          [
            ["Hook identification", "What happens in the first 0-3 seconds? What pattern is used (text, visual, verbal, combo)?"],
            ["Angle mapping", "Which Hit Hero angle (1: Invisible Distraction, 2: Credibility, 3: Skeptic Converter) does this align with? Or does it miss all three?"],
            ["Pacing structure", "Second-by-second timing: Hook (0-3s) / Body (3-8s) / Proof (8-12s) / CTA (12-15s)"],
            ["Copy extraction", "All spoken and on-screen copy pulled out, ready to adapt or test"],
            ["Tone check", "Does it pass Hit Hero brand rules? No m-dashes, no 'swing with confidence', no injury-first framing."],
            ["Strengths", "What's working that Hit Hero should learn from or adapt"],
            ["Weaknesses", "What's flat, off-brand, or missing"],
            ["Repurpose potential", "Could this be re-cut as a different format (static, carousel, longer video)?"]
          ]
        ),

        subtitle("Use Cases"),

        h3("Analyze your own Hit Hero ads"),
        bullet("Submit a draft or live ad to get a pre-flight check before spending"),
        bullet("Diagnose underperforming ads with timestamp-level feedback"),
        bullet("Verify hook, pacing, and CTA structure match the framework"),
        spacer(4),

        h3("Analyze competitor ads"),
        bullet("Pull competitor video ads from Meta Ad Library, Instagram, or YouTube"),
        bullet("Map their angles against Hit Hero's three angles to find white space"),
        bullet("Identify hooks, transitions, or proof patterns worth testing"),
        spacer(4),

        h3("Break down inspiration ads"),
        bullet("Submit any high-performing ad from any brand"),
        bullet("Get a full breakdown translated into Hit Hero's framework"),
        bullet("Output: 'If Hit Hero made this ad, here's what it would look like' with ready-to-use copy variants"),
        spacer(4),

        subtitle("Batch Upload"),
        para("Submit up to 10 videos at once. Each gets an individual report, plus a summary table ranking all videos by framework fit. The system identifies the strongest hook, best proof moment, and best CTA across the batch and outputs a combined 'best of' creative brief."),

        // ===== FATIGUE =====
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        title("CREATIVE FATIGUE SIGNALS"),
        para("Watch for:"),
        bullet("CPL rising 20%+ over 5 days"),
        bullet("CTR dropping below baseline"),
        bullet("Frequency hitting 3+"),
        spacer(6),
        boldPara("When fatigued: ", "Keep the message, change the creative. New hook, new player, new setting. Don't abandon a winning angle."),
      ]
    }
  ]
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync("/Users/justin/Downloads/Claude/HitHero-Creative-Ad-Framework.docx", buffer);
console.log("Done! File saved.");
