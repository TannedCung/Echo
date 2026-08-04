import type { BandTable, ObjectiveQuestion } from "./objective-scoring";

/**
 * The Listening paper library. Each test is a short spoken passage (a talk or
 * announcement) that Echo reads aloud through the TTS pipeline, followed by
 * objective questions graded by `objective-scoring.ts`. The `transcript` is what
 * gets synthesised and is hidden from the candidate while they answer — it is
 * only revealed afterwards in the report, so the exercise tests listening rather
 * than reading. Where TTS is unavailable, the surface falls back to letting the
 * candidate read the transcript, with a clear note.
 *
 * Scripts are original, Echo-authored monologues designed for a single narrator
 * voice.
 */

export interface ListeningTest {
  id: string;
  /** Human-friendly title, e.g. "Welcome to the city library". */
  title: string;
  /** Short description of the audio context shown before playback. */
  context: string;
  level: string;
  /** The spoken script, as ordered paragraphs, sent to TTS and shown in review. */
  transcript: string[];
  /** Optional map, floor plan, or schematic diagram visual asset. */
  imageUrl?: string;
  imageAlt?: string;
  questions: ObjectiveQuestion[];
}

export const LISTENING_TESTS: ListeningTest[] = [
  {
    id: "community-garden-induction",
    title: "Community garden induction",
    context:
      "You will hear a volunteer coordinator giving a short induction talk to new members of a community garden.",
    level: "Band 5.5–6.5",
    transcript: [
      "Hello everyone, and a very warm welcome to the Riverside Community Garden. My name is Dana, and I'm the volunteer coordinator, so I'll be your main point of contact for your first few weeks here.",
      "Let me start with the practical details. The garden is open from eight in the morning until dusk, seven days a week. Volunteers can come whenever suits them, but we do ask that you sign in at the shed by the main gate each time, mainly so we know who's on site in case of an emergency.",
      "Your membership includes access to all the shared tools, which you'll find in the green storage container, not the wooden shed — that one's just for seeds and paperwork. Please give the tools a quick clean before you put them back. The one thing we ask you to bring yourself is a pair of sturdy gloves, as we don't provide those.",
      "Each new member is given a small plot of their own, roughly three metres by two, and you're free to grow whatever you like on it, with one exception: we don't allow anything that spreads aggressively, like mint, because it quickly takes over the neighbouring plots.",
      "We hold a working day on the first Saturday of every month, starting at ten. That's when we tackle the bigger jobs together, like repairing paths and clearing the pond. Lunch is provided on those days, and it's honestly the best way to get to know the other members, so do come along if you can.",
      "Finally, if you have any questions during the week, the quickest way to reach me is by email rather than by phone, as I'm often out in the garden. My address is on the noticeboard by the gate. That's everything from me — enjoy your first season, and don't be afraid to ask for help.",
    ],
    questions: [
      {
        id: "l1-q1",
        type: "short-answer",
        prompt: "What is the name of the volunteer coordinator?",
        answers: ["Dana"],
        wordLimit: "One word",
      },
      {
        id: "l1-q2",
        type: "multiple-choice",
        prompt: "When is the garden open?",
        options: [
          "Weekdays only, from eight until dusk.",
          "Every day, from eight in the morning until dusk.",
          "Every day, twenty-four hours.",
          "Weekends only, from ten until dusk.",
        ],
        answers: ["Every day, from eight in the morning until dusk."],
      },
      {
        id: "l1-q3",
        type: "short-answer",
        prompt: "Where must volunteers sign in each time they arrive?",
        answers: ["the shed", "shed", "at the shed"],
        wordLimit: "No more than two words",
      },
      {
        id: "l1-q4",
        type: "multiple-choice",
        prompt: "Where are the shared tools kept?",
        options: [
          "In the wooden shed.",
          "In the green storage container.",
          "By the main gate.",
          "In each member's plot.",
        ],
        answers: ["In the green storage container."],
      },
      {
        id: "l1-q5",
        type: "short-answer",
        prompt: "What single item are volunteers asked to bring themselves?",
        answers: ["gloves", "a pair of gloves", "sturdy gloves"],
        wordLimit: "No more than three words",
      },
      {
        id: "l1-q6",
        type: "true-false-notgiven",
        prompt: "Members can grow any plant they wish on their plot.",
        answers: ["False"],
      },
      {
        id: "l1-q7",
        type: "short-answer",
        prompt: "Which plant is given as an example of one that is not allowed?",
        answers: ["mint"],
        wordLimit: "One word",
      },
      {
        id: "l1-q8",
        type: "multiple-choice",
        prompt: "When is the monthly working day held?",
        options: [
          "The last Sunday of the month.",
          "Every Saturday.",
          "The first Saturday of the month.",
          "The first Monday of the month.",
        ],
        answers: ["The first Saturday of the month."],
      },
      {
        id: "l1-q9",
        type: "true-false-notgiven",
        prompt: "Lunch is provided on the monthly working days.",
        answers: ["True"],
      },
      {
        id: "l1-q10",
        type: "multiple-choice",
        prompt: "What is the best way to contact the coordinator during the week?",
        options: ["By phone", "By email", "In person at the shed", "Through the noticeboard"],
        answers: ["By email"],
      },
    ],
  },
  {
    id: "museum-tour-briefing",
    title: "Museum tour briefing",
    context: "You will hear a guide briefing a group before a tour of a maritime museum.",
    level: "Band 6.0–7.0",
    transcript: [
      "Good morning, everyone, and welcome to the National Maritime Museum. Before we begin the tour, I'd just like to run through a few points so that everything goes smoothly.",
      "The tour lasts about ninety minutes in total, and we'll be covering three of the museum's main galleries. We'll start upstairs in the Age of Sail gallery, then move down to the Trade and Empire rooms, and finish in the newest gallery, which opened only last spring and focuses on modern shipping.",
      "A quick word about photography. You're very welcome to take photos in most of the museum, but please switch off your flash, as it can damage some of the older documents on display. There is one room, the map room, where photography of any kind is not permitted at all, and I'll remind you again when we get there.",
      "If we happen to get separated, don't worry. Simply make your way to the main entrance hall, where there's a large model ship in the centre, and wait for me there. Please don't try to find the group on your own, as the building is larger than it looks.",
      "At the halfway point we'll stop for around fifteen minutes in the café on the ground floor. It's a good chance to rest, and I'd recommend the coffee, though I should warn you the café doesn't take cash — card payments only.",
      "Finally, the gift shop is next to the exit, and it stays open for half an hour after the tour ends, so there's no need to rush your shopping. Right — if there are no questions, let's make our way to the stairs and begin.",
    ],
    questions: [
      {
        id: "l2-q1",
        type: "short-answer",
        prompt: "How long does the whole tour last?",
        answers: ["ninety minutes", "90 minutes", "ninety", "an hour and a half"],
        wordLimit: "No more than two words",
      },
      {
        id: "l2-q2",
        type: "multiple-choice",
        prompt: "Which gallery will the group visit first?",
        options: [
          "The Trade and Empire rooms",
          "The Age of Sail gallery",
          "The modern shipping gallery",
          "The map room",
        ],
        answers: ["The Age of Sail gallery"],
      },
      {
        id: "l2-q3",
        type: "true-false-notgiven",
        prompt: "The gallery on modern shipping is the museum's newest.",
        answers: ["True"],
      },
      {
        id: "l2-q4",
        type: "multiple-choice",
        prompt: "What are visitors asked to do about photography?",
        options: [
          "Take no photographs anywhere.",
          "Use flash only in the map room.",
          "Turn off their flash.",
          "Ask permission in every room.",
        ],
        answers: ["Turn off their flash."],
      },
      {
        id: "l2-q5",
        type: "short-answer",
        prompt: "In which room is photography completely forbidden?",
        answers: ["the map room", "map room"],
        wordLimit: "No more than two words",
      },
      {
        id: "l2-q6",
        type: "short-answer",
        prompt:
          "If separated, visitors should wait by the large model ship in which part of the museum?",
        answers: [
          "the entrance hall",
          "entrance hall",
          "main entrance hall",
          "the main entrance hall",
        ],
        wordLimit: "No more than three words",
      },
      {
        id: "l2-q7",
        type: "multiple-choice",
        prompt: "How long is the break at the café?",
        options: [
          "Around ten minutes",
          "Around fifteen minutes",
          "Around thirty minutes",
          "Around five minutes",
        ],
        answers: ["Around fifteen minutes"],
      },
      {
        id: "l2-q8",
        type: "true-false-notgiven",
        prompt: "The café accepts payment in cash.",
        answers: ["False"],
      },
      {
        id: "l2-q9",
        type: "short-answer",
        prompt: "For how long does the gift shop stay open after the tour?",
        answers: ["half an hour", "thirty minutes", "30 minutes"],
        wordLimit: "No more than three words",
      },
      {
        id: "l2-q10",
        type: "true-false-notgiven",
        prompt: "The guide says the building is smaller than it appears.",
        answers: ["False"],
      },
    ],
  },
  {
    id: "university-orientation-talk",
    title: "University orientation talk",
    context:
      "You will hear a university officer giving an orientation presentation to new international students.",
    level: "Band 5.5–6.5",
    transcript: [
      "Welcome everyone to Central University. My name is Marcus, and I'm from the International Student Services Office.",
      "First, let's locate the essential services on campus. The main student union building is located right next to the central library. Inside, you'll find the campus bookstore, student council offices, and the university health clinic on the second floor.",
      "Regarding your student ID cards, if you haven't collected yours yet, please visit the IT service desk in the science building before five o'clock today. You'll need your student ID for library borrowing, accessing computer labs, and entry into campus accommodation after eight in the evening.",
      "For student support, we offer free academic writing workshops every Tuesday afternoon at two o'clock in room B12. No prior booking is required, so you can simply turn up.",
      "Finally, please remember that international student registration forms must be submitted to our office by Friday afternoon at four o'clock.",
    ],
    questions: [
      {
        id: "l3-q1",
        type: "short-answer",
        prompt: "What is Marcus's role at the university?",
        answers: ["International Student Services", "officer", "student services"],
        wordLimit: "No more than three words",
      },
      {
        id: "l3-q2",
        type: "short-answer",
        prompt: "Where is the university health clinic located?",
        answers: ["second floor", "the second floor", "2nd floor"],
        wordLimit: "No more than two words",
      },
      {
        id: "l3-q3",
        type: "short-answer",
        prompt: "Where must students pick up their student ID cards?",
        answers: ["IT service desk", "science building"],
        wordLimit: "No more than three words",
      },
      {
        id: "l3-q4",
        type: "multiple-choice",
        prompt: "When are the academic writing workshops held?",
        options: [
          "Monday morning at ten",
          "Tuesday afternoon at two",
          "Wednesday evening at six",
          "Friday afternoon at four",
        ],
        answers: ["Tuesday afternoon at two"],
      },
      {
        id: "l3-q5",
        type: "true-false-notgiven",
        prompt: "Students must book in advance to attend the academic writing workshop.",
        answers: ["False"],
      },
      {
        id: "l3-q6",
        type: "short-answer",
        prompt: "By what time on Friday must registration forms be submitted?",
        answers: ["four o'clock", "4 o'clock", "4 pm", "4:00"],
        wordLimit: "No more than two words",
      },
      {
        id: "l3-q7",
        type: "true-false-notgiven",
        prompt: "The main library is open twenty-four hours a day.",
        answers: ["Not Given"],
      },
      {
        id: "l3-q8",
        type: "multiple-choice",
        prompt: "What is required for entry to accommodation after 8 pm?",
        options: ["Passport", "Student ID card", "Written permission", "Room key only"],
        answers: ["Student ID card"],
      },
      {
        id: "l3-q9",
        type: "true-false-notgiven",
        prompt: "The health clinic is on the ground floor of the student union.",
        answers: ["False"],
      },
      {
        id: "l3-q10",
        type: "short-answer",
        prompt: "In which room are the writing workshops held?",
        answers: ["B12", "room B12"],
        wordLimit: "No more than two words",
      },
    ],
  },
  {
    id: "sports-centre-induction",
    title: "Local sports centre induction",
    context: "You will hear a sports centre manager briefing new gym members.",
    level: "Band 6.0–7.0",
    transcript: [
      "Good evening and welcome to Westside Sports Centre. I'm Sarah, the facility manager.",
      "Our main gym floor is equipped with cardio machines and free weights. For safety reasons, we ask all members to wipe down equipment after use using the spray bottles located around the room.",
      "The swimming pool is open from six in the morning until nine at night. Swimming lanes four and five are always reserved for lap swimming during peak hours from five to seven in the evening.",
      "If you're interested in group fitness classes, spinning and yoga take place in Studio 1, while high-intensity interval training is held in Studio 2 upstairs.",
      "Locker rental is included in your membership, but you must bring your own padlock. Any lockers left locked overnight will be opened by staff.",
    ],
    questions: [
      {
        id: "l4-q1",
        type: "short-answer",
        prompt: "What is Sarah's position at the sports centre?",
        answers: ["facility manager", "manager"],
        wordLimit: "No more than two words",
      },
      {
        id: "l4-q2",
        type: "multiple-choice",
        prompt: "What time does the swimming pool open?",
        options: ["5:00 am", "6:00 am", "7:00 am", "8:00 am"],
        answers: ["6:00 am"],
      },
      {
        id: "l4-q3",
        type: "short-answer",
        prompt: "Which lanes are reserved for lap swimming during peak hours?",
        answers: ["lanes four and five", "four and five", "4 and 5"],
        wordLimit: "No more than three words",
      },
      {
        id: "l4-q4",
        type: "short-answer",
        prompt: "Where are high-intensity interval training classes held?",
        answers: ["Studio 2", "Studio 2 upstairs"],
        wordLimit: "No more than three words",
      },
      {
        id: "l4-q5",
        type: "true-false-notgiven",
        prompt: "The sports centre provides padlocks for members' lockers.",
        answers: ["False"],
      },
      {
        id: "l4-q6",
        type: "true-false-notgiven",
        prompt: "Lockers left locked overnight will be opened by security or staff.",
        answers: ["True"],
      },
      {
        id: "l4-q7",
        type: "multiple-choice",
        prompt: "Where are yoga classes conducted?",
        options: ["Studio 1", "Studio 2", "Main Gym", "Poolside"],
        answers: ["Studio 1"],
      },
      {
        id: "l4-q8",
        type: "short-answer",
        prompt: "What are members asked to do after using gym equipment?",
        answers: ["wipe down equipment", "wipe down", "clean equipment"],
        wordLimit: "No more than three words",
      },
      {
        id: "l4-q9",
        type: "true-false-notgiven",
        prompt: "Personal training sessions cost an extra fee.",
        answers: ["Not Given"],
      },
      {
        id: "l4-q10",
        type: "short-answer",
        prompt: "When are the peak hours for pool lap swimming in the evening?",
        answers: ["five to seven", "5 to 7", "5 pm to 7 pm"],
        wordLimit: "No more than three words",
      },
    ],
  },
  {
    id: "renewable-energy-presentation",
    title: "Renewable energy presentation",
    context: "You will hear an engineer giving a talk on local solar energy initiatives.",
    level: "Band 6.5–7.5",
    transcript: [
      "Hello everyone. Today I'll be summarizing the preliminary results of our community solar grid project in Greenvale.",
      "The solar installation consists of 450 photovoltaic panels mounted on the roof of the civic centre. Over the last twelve months, the system generated over 180 megawatt-hours of clean electricity.",
      "This generated power reduced local carbon emissions by approximately 120 metric tonnes, exceeding our initial estimates by fifteen percent.",
      "Maintenance costs remained exceptionally low, totaling less than two thousand pounds for the whole year, mainly spent on biannual panel cleaning.",
      "In phase two of the project, we plan to install a 100-kilowatt battery storage facility by next November, allowing stored energy to be used during peak evening demand.",
    ],
    questions: [
      {
        id: "l5-q1",
        type: "short-answer",
        prompt: "How many solar panels were installed on the civic centre roof?",
        answers: ["450", "four hundred and fifty"],
        wordLimit: "No more than two words",
      },
      {
        id: "l5-q2",
        type: "short-answer",
        prompt: "How much clean electricity was generated over the past twelve months?",
        answers: ["180 megawatt-hours", "180 MWh", "180 megawatt hours"],
        wordLimit: "No more than three words",
      },
      {
        id: "l5-q3",
        type: "multiple-choice",
        prompt: "By how much did the carbon reduction exceed initial estimates?",
        options: ["5 percent", "10 percent", "15 percent", "20 percent"],
        answers: ["15 percent"],
      },
      {
        id: "l5-q4",
        type: "short-answer",
        prompt: "What was the main maintenance expense spent on?",
        answers: ["panel cleaning", "cleaning"],
        wordLimit: "No more than two words",
      },
      {
        id: "l5-q5",
        type: "true-false-notgiven",
        prompt: "Total maintenance costs for the year exceeded five thousand pounds.",
        answers: ["False"],
      },
      {
        id: "l5-q6",
        type: "short-answer",
        prompt: "What facility will be installed in phase two of the project?",
        answers: ["battery storage facility", "battery storage", "storage facility"],
        wordLimit: "No more than three words",
      },
      {
        id: "l5-q7",
        type: "true-false-notgiven",
        prompt: "Phase two installation is planned for completion by next November.",
        answers: ["True"],
      },
      {
        id: "l5-q8",
        type: "multiple-choice",
        prompt: "Where is the solar panel array located?",
        options: ["Civic centre roof", "Town hall field", "Library roof", "School park"],
        answers: ["Civic centre roof"],
      },
      {
        id: "l5-q9",
        type: "true-false-notgiven",
        prompt: "The project received government funding grants.",
        answers: ["Not Given"],
      },
      {
        id: "l5-q10",
        type: "short-answer",
        prompt: "How many metric tonnes of carbon emissions were reduced?",
        answers: ["120", "120 metric tonnes", "120 tonnes"],
        wordLimit: "No more than three words",
      },
    ],
  },
  {
    id: "historical-city-tour",
    title: "Historical city tour overview",
    context: "You will hear a tour guide explaining the itinerary for a historical city walk.",
    level: "Band 5.5–6.5",
    transcript: [
      "Good morning, travelers. Welcome to the Old Town Walking Tour.",
      "We will begin our walk at St. Peter's Square and make our way down High Street toward the medieval Clock Tower.",
      "The Clock Tower was built in 1420 and remains one of the oldest functioning astronomical clocks in the region.",
      "After visiting the tower, we will cross the river via the Stone Bridge, which was constructed in the seventeenth century to replace an earlier wooden structure.",
      "Our final stop will be the Merchant Guild Hall, where tea and traditional pastries will be served in the courtyard.",
    ],
    questions: [
      {
        id: "l6-q1",
        type: "short-answer",
        prompt: "Where does the walking tour begin?",
        answers: ["St. Peter's Square", "St Peter's Square"],
        wordLimit: "No more than three words",
      },
      {
        id: "l6-q2",
        type: "short-answer",
        prompt: "In which year was the Clock Tower built?",
        answers: ["1420"],
        wordLimit: "One word",
      },
      {
        id: "l6-q3",
        type: "multiple-choice",
        prompt: "What structure preceded the Stone Bridge?",
        options: ["A iron bridge", "A wooden structure", "A ferry crossing", "A drawbridge"],
        answers: ["A wooden structure"],
      },
      {
        id: "l6-q4",
        type: "short-answer",
        prompt: "In which century was the Stone Bridge constructed?",
        answers: ["seventeenth century", "17th century", "17th"],
        wordLimit: "No more than two words",
      },
      {
        id: "l6-q5",
        type: "short-answer",
        prompt: "Where is tea served at the end of the tour?",
        answers: ["Merchant Guild Hall", "the courtyard", "Guild Hall courtyard"],
        wordLimit: "No more than three words",
      },
      {
        id: "l6-q6",
        type: "true-false-notgiven",
        prompt: "The Clock Tower is no longer functional today.",
        answers: ["False"],
      },
      {
        id: "l6-q7",
        type: "true-false-notgiven",
        prompt: "Pastries served at the end of the tour are included in the ticket price.",
        answers: ["Not Given"],
      },
      {
        id: "l6-q8",
        type: "multiple-choice",
        prompt: "Which street will the group walk down toward the Clock Tower?",
        options: ["King Street", "High Street", "Church Lane", "Market Road"],
        answers: ["High Street"],
      },
      {
        id: "l6-q9",
        type: "true-false-notgiven",
        prompt: "The tour crosses the river using a wooden bridge.",
        answers: ["False"],
      },
      {
        id: "l6-q10",
        type: "short-answer",
        prompt: "What kind of clock is housed inside the Clock Tower?",
        answers: ["astronomical clock", "astronomical"],
        wordLimit: "No more than two words",
      },
    ],
  },
  {
    id: "public-library-renovation",
    title: "Public library renovation briefing",
    context: "You will hear a head librarian briefing staff on upcoming building renovations.",
    level: "Band 6.0–7.0",
    transcript: [
      "Thank you for attending this morning's briefing. As you know, our main library branch will undergo major renovation starting next month.",
      "The ground floor will be expanded to create a dedicated digital learning hub with thirty public computer workstations and high-speed Wi-Fi.",
      "The quiet study area currently on the second floor will move up to the third floor to minimise noise disturbance from the ground floor café.",
      "During the four-month renovation period, the main building will remain closed to the public, but a temporary borrowing desk will operate from the annex building next door.",
    ],
    questions: [
      {
        id: "l7-q1",
        type: "short-answer",
        prompt: "When will the library renovation begin?",
        answers: ["next month"],
        wordLimit: "No more than two words",
      },
      {
        id: "l7-q2",
        type: "short-answer",
        prompt: "What will be created on the ground floor?",
        answers: ["digital learning hub", "a digital learning hub", "learning hub"],
        wordLimit: "No more than three words",
      },
      {
        id: "l7-q3",
        type: "short-answer",
        prompt: "How many public computer workstations will be installed?",
        answers: ["thirty", "30"],
        wordLimit: "One word",
      },
      {
        id: "l7-q4",
        type: "multiple-choice",
        prompt: "To which floor will the quiet study area move?",
        options: ["First floor", "Second floor", "Third floor", "Basement"],
        answers: ["Third floor"],
      },
      {
        id: "l7-q5",
        type: "short-answer",
        prompt: "How long will the renovation period last?",
        answers: ["four months", "4 months"],
        wordLimit: "No more than two words",
      },
      {
        id: "l7-q6",
        type: "short-answer",
        prompt: "Where will the temporary borrowing desk operate during renovation?",
        answers: ["the annex building", "annex building", "annex"],
        wordLimit: "No more than three words",
      },
      {
        id: "l7-q7",
        type: "true-false-notgiven",
        prompt: "The main building will stay open to visitors throughout the renovation.",
        answers: ["False"],
      },
      {
        id: "l7-q8",
        type: "true-false-notgiven",
        prompt: "The library café will close permanently after the renovation.",
        answers: ["Not Given"],
      },
      {
        id: "l7-q9",
        type: "multiple-choice",
        prompt: "Why is the quiet study area moving to a higher floor?",
        options: [
          "To provide better natural light",
          "To minimise noise from the ground floor café",
          "To create space for book stacks",
          "To accommodate more desks",
        ],
        answers: ["To minimise noise from the ground floor café"],
      },
      {
        id: "l7-q10",
        type: "true-false-notgiven",
        prompt: "High-speed Wi-Fi will be available in the new digital learning hub.",
        answers: ["True"],
      },
    ],
  },
  {
    id: "student-housing-briefing",
    title: "Student accommodation briefing",
    context: "You will hear a housing warden explaining rules to new hostel residents.",
    level: "Band 5.5–6.5",
    transcript: [
      "Good evening, residents. Welcome to Oakridge Student Hostel. I'm Warden Henderson.",
      "Kitchen cleaning responsibilities are rotated weekly among room groups. Please check the duty schedule posted on the refrigerator door in your shared kitchen.",
      "Quiet hours are strictly enforced from ten in the evening until seven in the morning on weekdays, and midnight to eight in the morning on weekends.",
      "Guests are allowed in common areas until nine o'clock at night, but overnight visitors require advance written approval from the warden's office.",
    ],
    questions: [
      {
        id: "l8-q1",
        type: "short-answer",
        prompt: "What is the name of the hostel warden?",
        answers: ["Warden Henderson", "Henderson"],
        wordLimit: "No more than two words",
      },
      {
        id: "l8-q2",
        type: "short-answer",
        prompt: "Where is the kitchen cleaning duty schedule posted?",
        answers: ["refrigerator door", "the refrigerator door", "fridge door"],
        wordLimit: "No more than three words",
      },
      {
        id: "l8-q3",
        type: "multiple-choice",
        prompt: "When do weekday quiet hours begin?",
        options: ["9:00 pm", "10:00 pm", "11:00 pm", "Midnight"],
        answers: ["10:00 pm"],
      },
      {
        id: "l8-q4",
        type: "short-answer",
        prompt: "Until what time are non-resident guests allowed in common areas?",
        answers: ["nine o'clock", "9 o'clock", "9 pm", "9:00 pm"],
        wordLimit: "No more than two words",
      },
      {
        id: "l8-q5",
        type: "true-false-notgiven",
        prompt: "Overnight visitors are permitted without prior notice.",
        answers: ["False"],
      },
      {
        id: "l8-q6",
        type: "true-false-notgiven",
        prompt: "Quiet hours on weekends end at eight in the morning.",
        answers: ["True"],
      },
      {
        id: "l8-q7",
        type: "short-answer",
        prompt: "What is required from the warden's office for overnight guests?",
        answers: ["advance written approval", "written approval", "approval"],
        wordLimit: "No more than three words",
      },
      {
        id: "l8-q8",
        type: "multiple-choice",
        prompt: "How often is the kitchen cleaning schedule rotated?",
        options: ["Daily", "Weekly", "Bi-weekly", "Monthly"],
        answers: ["Weekly"],
      },
      {
        id: "l8-q9",
        type: "true-false-notgiven",
        prompt: "Smoking is allowed in private bedrooms.",
        answers: ["Not Given"],
      },
      {
        id: "l8-q10",
        type: "true-false-notgiven",
        prompt: "Kitchen cleaning duty is shared among room groups.",
        answers: ["True"],
      },
    ],
  },
  {
    id: "wildlife-sanctuary-tour",
    title: "Wildlife sanctuary orientation",
    context: "You will hear a ranger introducing visitors to a wetland bird sanctuary.",
    level: "Band 6.5–7.5",
    transcript: [
      "Welcome to the Tidal Marshes Wildlife Reserve. I'm Ranger David.",
      "Our sanctuary protects over two hundred species of migratory waterfowl. The best viewing spot for kingfishers and herons is the North Observation Hide, located a twenty-minute walk along the wooden boardwalk.",
      "Please remain on designated wooden walkways at all times to avoid disturbing fragile marsh vegetation and nesting grounds.",
      "Guided birdwatching tours leave from the visitor centre every hour on the hour, starting at nine in the morning.",
    ],
    questions: [
      {
        id: "l9-q1",
        type: "short-answer",
        prompt: "What is the ranger's name?",
        answers: ["Ranger David", "David"],
        wordLimit: "No more than two words",
      },
      {
        id: "l9-q2",
        type: "short-answer",
        prompt: "How many species of migratory waterfowl does the reserve protect?",
        answers: ["over two hundred", "200", "over 200"],
        wordLimit: "No more than three words",
      },
      {
        id: "l9-q3",
        type: "short-answer",
        prompt: "What is the best spot for viewing kingfishers and herons?",
        answers: ["North Observation Hide", "the North Observation Hide"],
        wordLimit: "No more than three words",
      },
      {
        id: "l9-q4",
        type: "short-answer",
        prompt: "How long does it take to walk to the North Observation Hide?",
        answers: ["twenty minutes", "20 minutes", "20 mins"],
        wordLimit: "No more than two words",
      },
      {
        id: "l9-q5",
        type: "multiple-choice",
        prompt: "How frequently do guided birdwatching tours depart?",
        options: ["Every 30 minutes", "Every hour", "Twice a day", "Every two hours"],
        answers: ["Every hour"],
      },
      {
        id: "l9-q6",
        type: "true-false-notgiven",
        prompt: "Visitors are allowed to walk off designated wooden walkways.",
        answers: ["False"],
      },
      {
        id: "l9-q7",
        type: "true-false-notgiven",
        prompt: "Binoculars are available for rent at the visitor centre.",
        answers: ["Not Given"],
      },
      {
        id: "l9-q8",
        type: "multiple-choice",
        prompt: "At what time do guided birdwatching tours start in the morning?",
        options: ["8:00 am", "9:00 am", "10:00 am", "11:00 am"],
        answers: ["9:00 am"],
      },
      {
        id: "l9-q9",
        type: "true-false-notgiven",
        prompt: "The reserve protects marsh vegetation and nesting grounds.",
        answers: ["True"],
      },
      {
        id: "l9-q10",
        type: "short-answer",
        prompt: "What pathway structure leads to the observation hide?",
        answers: ["wooden boardwalk", "boardwalk", "wooden walkways"],
        wordLimit: "No more than two words",
      },
    ],
  },
  {
    id: "career-fair-keynote",
    title: "Career fair opening address",
    context: "You will hear an advisor opening a graduate career and employment fair.",
    level: "Band 6.0–7.0",
    transcript: [
      "Good morning, graduates. Welcome to the Annual Tech and Business Career Fair.",
      "Over sixty employers are exhibiting today across Main Exhibition Hall A and Hall B.",
      "If you'd like resume advice, our career counselor team is holding free fifteen-minute one-on-one sessions in Consultation Room 3 throughout the day.",
      "Keynote employer presentations will start at eleven o'clock in the main auditorium, beginning with global software engineering opportunities.",
    ],
    questions: [
      {
        id: "l10-q1",
        type: "short-answer",
        prompt: "How many employers are exhibiting at the career fair?",
        answers: ["over sixty", "60", "over 60"],
        wordLimit: "No more than two words",
      },
      {
        id: "l10-q2",
        type: "short-answer",
        prompt: "In which rooms are free resume consultation sessions held?",
        answers: ["Consultation Room 3", "Room 3"],
        wordLimit: "No more than three words",
      },
      {
        id: "l10-q3",
        type: "short-answer",
        prompt: "How long is each one-on-one resume advice session?",
        answers: ["fifteen minutes", "15 minutes", "15 mins"],
        wordLimit: "No more than two words",
      },
      {
        id: "l10-q4",
        type: "multiple-choice",
        prompt: "Where will the keynote employer presentations take place?",
        options: ["Exhibition Hall A", "Consultation Room 3", "Main Auditorium", "Hall B"],
        answers: ["Main Auditorium"],
      },
      {
        id: "l10-q5",
        type: "short-answer",
        prompt: "At what time do keynote presentations start?",
        answers: ["eleven o'clock", "11 o'clock", "11:00 am", "11 am"],
        wordLimit: "No more than two words",
      },
      {
        id: "l10-q6",
        type: "true-false-notgiven",
        prompt: "Resume consultation sessions require a fee.",
        answers: ["False"],
      },
      {
        id: "l10-q7",
        type: "true-false-notgiven",
        prompt: "Lunch is provided for registered graduates.",
        answers: ["Not Given"],
      },
      {
        id: "l10-q8",
        type: "multiple-choice",
        prompt: "Which topic opens the keynote employer presentations?",
        options: [
          "Global software engineering opportunities",
          "Finance and banking careers",
          "Digital marketing trends",
          "Startup funding advice",
        ],
        answers: ["Global software engineering opportunities"],
      },
      {
        id: "l10-q9",
        type: "true-false-notgiven",
        prompt: "Exhibitors are located in Main Exhibition Hall A and Hall B.",
        answers: ["True"],
      },
      {
        id: "l10-q10",
        type: "short-answer",
        prompt: "Who is holding the resume advice sessions?",
        answers: ["career counselor team", "career counselors", "career advisor"],
        wordLimit: "No more than three words",
      },
    ],
  },
];

/**
 * Listening raw→band conversion (out of 40), from widely published IELTS
 * guidance. Ordered high→low; `rawToBand` scales shorter practice papers to /40.
 *
 * @see https://www.ielts.org/for-test-takers/how-ielts-is-scored
 */
export const LISTENING_BAND_TABLE: BandTable = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [32, 7.5],
  [30, 7],
  [26, 6.5],
  [23, 6],
  [18, 5.5],
  [16, 5],
  [13, 4.5],
  [11, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [3, 2],
  [2, 1.5],
  [1, 1],
];

/** The full text sent to TTS for a listening test. */
export function transcriptText(test: ListeningTest): string {
  return test.transcript.join("\n\n");
}

export function getListeningTest(id: string): ListeningTest | undefined {
  return LISTENING_TESTS.find((test) => test.id === id);
}

/** Deterministic pick from a seed; no seed → the first test. */
export function pickListeningTest(seed?: string): ListeningTest {
  if (!seed) return LISTENING_TESTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return LISTENING_TESTS[Math.abs(hash) % LISTENING_TESTS.length];
}
