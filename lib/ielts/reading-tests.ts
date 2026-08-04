import type { BandTable, ObjectiveQuestion } from "./objective-scoring";

/**
 * The Reading paper library. Each test is one Academic-style passage followed by
 * a mix of question types (True/False/Not Given, multiple choice, and short
 * sentence-completion), graded objectively by `objective-scoring.ts`. Passages
 * are original, Echo-authored texts written to feel like the real thing without
 * reproducing copyrighted material. This is the single source of truth for
 * Reading content — the route grades against it and the report reviews it.
 */

export interface ReadingTest {
  id: string;
  /** Human-friendly theme, e.g. "The return of the wolf". */
  title: string;
  /** Rough band this passage is pitched at, for the picker. */
  level: string;
  /** The reading passage, as ordered paragraphs. */
  passage: string[];
  /** Optional scientific diagram, map, or schematic figure. */
  imageUrl?: string;
  imageAlt?: string;
  questions: ObjectiveQuestion[];
}

export const READING_TESTS: ReadingTest[] = [
  {
    id: "the-quiet-return-of-the-beaver",
    title: "The quiet return of the beaver",
    level: "Band 6.0–7.0",
    passage: [
      "For most of the last four centuries, the European beaver was a ghost across much of its former range. Hunted relentlessly for its fur, its meat and a secretion once prized in medicine, the animal had vanished from Britain by the sixteenth century and clung on elsewhere only in a handful of isolated pockets. By 1900, fewer than 1,200 beavers were thought to survive on the entire continent. It seemed a species quietly bowing out.",
      "The reversal that followed is one of conservation's less celebrated success stories. Beginning in the 1920s, a scattering of reintroduction schemes released small groups of beavers into protected rivers. Progress was slow and often unofficial. In Britain, the animals returned not through a grand national plan but partly by accident, when individuals escaped from private collections and established themselves along quiet waterways before anyone in authority had decided whether they should be there at all.",
      "What makes the beaver's return significant is not the animal itself but what it does to the landscape. Beavers are what ecologists call a keystone species: their presence reshapes the environment in ways that benefit a great many other creatures. By felling trees and damming streams, a single family can transform a narrow channel into a chain of ponds and wetlands. These new habitats slow the flow of water, trap sediment, and create still, shallow margins where insects, fish and amphibians thrive.",
      "The benefits extend to people too, though this took longer to be recognised. The wetlands that beavers create act as natural sponges, holding back water during heavy rain and releasing it slowly in dry spells. In several catchments, researchers have measured markedly lower flood peaks downstream of beaver dams. As the cost of engineered flood defences continues to rise, some water authorities have begun to treat beavers less as a nuisance and more as unpaid labour.",
      "Not everyone is convinced. Farmers whose fields are flooded, or whose drainage ditches are blocked, tend to take a dimmer view of the animal's engineering. Flooded farmland, gnawed orchard trees and undermined riverbanks are real costs, and they fall unevenly on the people who happen to live alongside the new arrivals. Where reintroduction has been managed well, compensation schemes and the removal of problem individuals have kept local opposition manageable. Where it has been handled poorly, resentment has followed.",
      "The debate, in the end, is less about the beaver than about how much wildness a crowded, farmed landscape can accommodate. The animal will keep building regardless of the arguments made about it. The question is whether the people who share its rivers can be persuaded that the ponds, the flooded willows and the slow, patient reshaping of the land are a price worth paying for the water it stores and the life it brings back.",
    ],
    questions: [
      {
        id: "r1-q1",
        type: "true-false-notgiven",
        prompt:
          "By 1900, the European beaver population across the continent had fallen below 1,200.",
        answers: ["True"],
      },
      {
        id: "r1-q2",
        type: "true-false-notgiven",
        prompt: "Beavers were hunted partly for a substance used in medicine.",
        answers: ["True"],
      },
      {
        id: "r1-q3",
        type: "true-false-notgiven",
        prompt:
          "The reintroduction schemes of the 1920s were coordinated by a single European authority.",
        answers: ["False"],
      },
      {
        id: "r1-q4",
        type: "true-false-notgiven",
        prompt: "Beavers in Britain are more popular with the public than in any other country.",
        answers: ["Not Given"],
      },
      {
        id: "r1-q5",
        type: "true-false-notgiven",
        prompt: "Engineered flood defences are becoming cheaper over time.",
        answers: ["False"],
      },
      {
        id: "r1-q6",
        type: "multiple-choice",
        prompt: "Why does the writer describe the beaver as a 'keystone species'?",
        options: [
          "Because it is the largest rodent found in Europe.",
          "Because its activity changes the habitat in ways that help many other species.",
          "Because it was the first animal to be reintroduced to Britain.",
          "Because it is protected by law across the continent.",
        ],
        answers: ["Because its activity changes the habitat in ways that help many other species."],
      },
      {
        id: "r1-q7",
        type: "multiple-choice",
        prompt: "According to the passage, how did beavers return to some British rivers?",
        options: [
          "Through a national reintroduction plan.",
          "By migrating from mainland Europe.",
          "By escaping from private collections.",
          "By being released by farmers.",
        ],
        answers: ["By escaping from private collections."],
      },
      {
        id: "r1-q8",
        type: "multiple-choice",
        prompt: "Why have some water authorities changed their attitude to beavers?",
        options: [
          "Beavers reduce flood peaks downstream at no cost.",
          "Beavers are now a protected species.",
          "Beavers attract tourists to rivers.",
          "Beavers remove sediment from drinking water.",
        ],
        answers: ["Beavers reduce flood peaks downstream at no cost."],
      },
      {
        id: "r1-q9",
        type: "short-answer",
        prompt:
          "Complete the sentence: The wetlands beavers create act as natural ________, holding back water during heavy rain.",
        answers: ["sponges", "sponge"],
        wordLimit: "One word",
      },
      {
        id: "r1-q10",
        type: "short-answer",
        prompt:
          "Complete the sentence: By felling trees and ________ streams, a beaver family can create a chain of ponds.",
        answers: ["damming"],
        wordLimit: "One word",
      },
      {
        id: "r1-q11",
        type: "short-answer",
        prompt:
          "Complete the sentence: The costs of the beaver's activity fall ________ on the people who live nearby.",
        answers: ["unevenly"],
        wordLimit: "One word",
      },
      {
        id: "r1-q12",
        type: "true-false-notgiven",
        prompt:
          "Compensation schemes have helped reduce local opposition where reintroduction was well managed.",
        answers: ["True"],
      },
      {
        id: "r1-q13",
        type: "multiple-choice",
        prompt: "What does the writer suggest the debate is ultimately about?",
        options: [
          "How to eradicate beavers from farmland.",
          "How much wildness a farmed landscape can accept.",
          "Whether beavers should be hunted again.",
          "How to make flood defences cheaper.",
        ],
        answers: ["How much wildness a farmed landscape can accept."],
      },
    ],
  },
  {
    id: "the-science-of-the-siesta",
    title: "The science of the siesta",
    level: "Bands 6–7.5",
    passage: [
      "The idea that humans are built for a single, unbroken block of night-time sleep is surprisingly modern. Historical records suggest that before artificial lighting was widespread, many people slept in two phases, with an hour or so of quiet wakefulness in the middle of the night. The afternoon dip in alertness that many of us feel after lunch is not, as is often assumed, simply the result of a heavy meal. It appears to be part of the body's natural rhythm, a scheduled lull that occurs whether or not we have eaten.",
      "This afternoon slump has a physiological basis. Body temperature, which tracks our cycles of alertness, falls slightly in the early afternoon before rising again. In cultures where a midday rest, or siesta, is traditional, daily life has long been organised around this dip. Shops close, streets empty, and activity resumes in the cooler, more productive hours of the late afternoon and evening. Far from being a sign of laziness, the siesta may represent a sensible accommodation to how human alertness actually works.",
      "Laboratory studies of short daytime sleep have produced striking results. A nap of around twenty minutes can improve alertness, mood and reaction time for several hours, without leaving the grogginess that follows a longer sleep. This grogginess, known as sleep inertia, occurs when a sleeper is woken from the deeper stages of sleep. Keeping the nap short avoids these stages, which is why the most effective naps are also among the briefest.",
      "The benefits are not limited to feeling more awake. Several studies have linked regular short naps to better performance on tasks requiring memory and learning. The sleeping brain appears to consolidate recently acquired information, strengthening the connections that store it. A student who naps after studying may, in effect, be giving the day's learning time to settle. Some companies, persuaded by such findings, have installed rest areas and now quietly encourage staff to sleep during the working day.",
      "Yet the practice remains controversial in many workplaces, where sleeping on the job carries a stubborn stigma. There are practical objections too. A nap taken too late in the day can make it harder to fall asleep at night, and for people who already sleep poorly, daytime sleep may make matters worse rather than better. The evidence, in other words, favours the nap for most people most of the time — but not as a universal remedy.",
      "What the research does suggest is that the rigid boundary many societies draw between waking and sleeping is more a cultural habit than a biological necessity. The body, left to its own devices, seems inclined to rest more than once a day. Whether modern working life can ever be reorganised to suit that inclination is, for now, an open question.",
    ],
    questions: [
      {
        id: "r2-q1",
        type: "true-false-notgiven",
        prompt:
          "The belief that humans should sleep in one unbroken block at night is a relatively recent one.",
        answers: ["True"],
      },
      {
        id: "r2-q2",
        type: "true-false-notgiven",
        prompt: "The afternoon dip in alertness is caused only by eating a large lunch.",
        answers: ["False"],
      },
      {
        id: "r2-q3",
        type: "true-false-notgiven",
        prompt: "Body temperature rises steadily throughout the afternoon.",
        answers: ["False"],
      },
      {
        id: "r2-q4",
        type: "true-false-notgiven",
        prompt: "Siestas are more common in hot countries than in cold ones.",
        answers: ["Not Given"],
      },
      {
        id: "r2-q5",
        type: "multiple-choice",
        prompt: "Why are the most effective naps described as short?",
        options: [
          "Short naps are easier to fit into a working day.",
          "Short naps avoid the deep sleep stages that cause grogginess.",
          "Short naps use less energy than long ones.",
          "Short naps are recommended by most companies.",
        ],
        answers: ["Short naps avoid the deep sleep stages that cause grogginess."],
      },
      {
        id: "r2-q6",
        type: "short-answer",
        prompt:
          "Complete the sentence: The grogginess that follows a longer sleep is known as sleep ________.",
        answers: ["inertia"],
        wordLimit: "One word",
      },
      {
        id: "r2-q7",
        type: "multiple-choice",
        prompt: "How might a nap help a student who has just studied?",
        options: [
          "It replaces the need for further study.",
          "It gives the brain time to consolidate what was learned.",
          "It improves body temperature control.",
          "It removes the need for night-time sleep.",
        ],
        answers: ["It gives the brain time to consolidate what was learned."],
      },
      {
        id: "r2-q8",
        type: "true-false-notgiven",
        prompt: "Some companies have created spaces where staff can sleep during the working day.",
        answers: ["True"],
      },
      {
        id: "r2-q9",
        type: "true-false-notgiven",
        prompt: "Napping is beneficial for absolutely everyone in every situation.",
        answers: ["False"],
      },
      {
        id: "r2-q10",
        type: "short-answer",
        prompt:
          "Complete the sentence: A nap of around ________ minutes can improve alertness for several hours.",
        answers: ["twenty", "20"],
        wordLimit: "One word or a number",
      },
      {
        id: "r2-q11",
        type: "multiple-choice",
        prompt: "What is the writer's overall conclusion about napping?",
        options: [
          "It is a universal remedy for tiredness.",
          "It is harmful for most people.",
          "It suits most people most of the time, but is not for everyone.",
          "It should replace night-time sleep entirely.",
        ],
        answers: ["It suits most people most of the time, but is not for everyone."],
      },
      {
        id: "r2-q12",
        type: "true-false-notgiven",
        prompt:
          "The writer says the divide between waking and sleeping is more cultural than biological.",
        answers: ["True"],
      },
    ],
  },
  {
    id: "architecture-of-ancient-aqueducts",
    title: "The engineering of Roman aqueducts",
    level: "Band 6.0–7.0",
    passage: [
      "The survival of vast Roman urban centres depended fundamentally on the regular supply of fresh water. Where local springs and wells proved insufficient for growing populations, Roman engineers constructed remarkable systems of channels and arcades known as aqueducts. Spanning hundreds of kilometres across the empire, these structures delivered millions of litres of water daily to public baths, fountains and private residences.",
      "Contrary to popular belief, most of an aqueduct system was built underground. Subterranean conduits protected the water from contamination, evaporation and extreme weather, while also minimising disruption to agriculture on the surface. Above-ground stone arches were used primarily to cross valleys or maintain the necessary downward slope across low terrain.",
      "Maintaining a constant, gentle gradient was the central technical challenge. If the slope was too steep, the rushing water would erode the masonry lining; if too flat, the flow would stall and sediment would settle, clogging the channel. Engineers relied on precise surveying instruments, such as the chorobates—a long wooden bench fitted with water levels and plumb lines.",
      "Regular maintenance was essential. Mineral deposits, particularly calcium carbonate, accumulated on channel walls over time, gradually restricting water flow. Teams of enslaved workers and specialized maintenance crews were deployed to scrub the lining and repair cracked hydraulic mortar.",
    ],
    questions: [
      {
        id: "r3-q1",
        type: "true-false-notgiven",
        prompt: "Most Roman aqueduct conduits were constructed above ground on stone arches.",
        answers: ["False"],
      },
      {
        id: "r3-q2",
        type: "true-false-notgiven",
        prompt:
          "Underground channels helped protect water supplies from contamination and evaporation.",
        answers: ["True"],
      },
      {
        id: "r3-q3",
        type: "short-answer",
        prompt:
          "What long wooden surveying instrument did Roman engineers use to measure gradients?",
        answers: ["chorobates", "the chorobates"],
        wordLimit: "No more than two words",
      },
      {
        id: "r3-q4",
        type: "short-answer",
        prompt:
          "Which mineral deposit commonly built up on channel walls and restricted water flow?",
        answers: ["calcium carbonate"],
        wordLimit: "No more than two words",
      },
      {
        id: "r3-q5",
        type: "multiple-choice",
        prompt: "Why was a water slope that was too steep considered problematic?",
        options: [
          "It caused the water to freeze in winter.",
          "It eroded the masonry lining of the channel.",
          "It led to immediate evaporation.",
          "It made surveying impossible.",
        ],
        answers: ["It eroded the masonry lining of the channel."],
      },
      {
        id: "r3-q6",
        type: "true-false-notgiven",
        prompt: "Aqueduct water was supplied exclusively to wealthy private homes.",
        answers: ["False"],
      },
      {
        id: "r3-q7",
        type: "multiple-choice",
        prompt: "What was used above ground to cross low terrain or valleys?",
        options: ["Wooden pipes", "Stone arches", "Earthen dams", "Bronze aqueducts"],
        answers: ["Stone arches"],
      },
      {
        id: "r3-q8",
        type: "true-false-notgiven",
        prompt: "Roman aqueduct engineers received formal university degrees.",
        answers: ["Not Given"],
      },
      {
        id: "r3-q9",
        type: "short-answer",
        prompt: "What kind of mortar was used to repair cracks in the aqueduct channel lining?",
        answers: ["hydraulic mortar"],
        wordLimit: "No more than two words",
      },
      {
        id: "r3-q10",
        type: "true-false-notgiven",
        prompt:
          "If the aqueduct gradient was too flat, water flow could stall and sediment would settle.",
        answers: ["True"],
      },
    ],
  },
  {
    id: "evolution-of-bipedalism",
    title: "The evolution of human bipedalism",
    level: "Band 6.5–7.5",
    passage: [
      "The transition from quadrupedal locomotion to walking upright on two legs is widely regarded as a defining milestone in human evolutionary history. Fossil evidence suggests that early hominins began walking bipedally around six million years ago, long before the dramatic expansion of brain size recorded in later ancestral species.",
      "Several hypotheses have been advanced to explain why upright walking emerged. The savanna hypothesis posited that as ancestral forests shrank due to climate change, early hominins benefited from upright postures that allowed them to scan tall grassland for predators. However, recent fossil discoveries in forested environments suggest bipedalism developed before forests vanished.",
      "Another prominent explanation focuses on energy efficiency. Biomechanical models demonstrate that bipedal walking consumes substantially less energy over long distances than quadrupedal knuckle-walking as seen in modern chimpanzees. This energetic advantage enabled early foragers to travel greater distances in search of dispersed food resources.",
      "Additionally, standing upright reduced the body surface area exposed to direct overhead solar radiation while exposing the body to cooler elevated breezes, aiding thermoregulation in tropical environments.",
    ],
    questions: [
      {
        id: "r4-q1",
        type: "true-false-notgiven",
        prompt: "Early hominins began walking on two legs around six million years ago.",
        answers: ["True"],
      },
      {
        id: "r4-q2",
        type: "true-false-notgiven",
        prompt: "Brain size expansion occurred before hominins adapted to upright walking.",
        answers: ["False"],
      },
      {
        id: "r4-q3",
        type: "multiple-choice",
        prompt: "What key advantage of bipedalism is highlighted by biomechanical models?",
        options: [
          "Greater sprinting speed over short distances",
          "Energy efficiency over long distances",
          "Improved tree climbing ability",
          "Ability to swim across wide rivers",
        ],
        answers: ["Energy efficiency over long distances"],
      },
      {
        id: "r4-q4",
        type: "short-answer",
        prompt:
          "According to recent fossil discoveries, in what environment did bipedalism develop?",
        answers: ["forested environments", "forests"],
        wordLimit: "No more than two words",
      },
      {
        id: "r4-q5",
        type: "short-answer",
        prompt: "What did standing upright reduce the exposure of the body to?",
        answers: ["direct overhead solar radiation", "solar radiation", "sunlight"],
        wordLimit: "No more than four words",
      },
      {
        id: "r4-q6",
        type: "true-false-notgiven",
        prompt: "Chimpanzee knuckle-walking requires less energy than human walking.",
        answers: ["False"],
      },
      {
        id: "r4-q7",
        type: "true-false-notgiven",
        prompt: "Early hominins used stone tools to hunt large animals on the savanna.",
        answers: ["Not Given"],
      },
      {
        id: "r4-q8",
        type: "multiple-choice",
        prompt: "How did exposure to elevated breezes benefit upright hominins?",
        options: [
          "By increasing swimming speed",
          "By aiding thermoregulation",
          "By scaring off predators",
          "By improving vision",
        ],
        answers: ["By aiding thermoregulation"],
      },
      {
        id: "r4-q9",
        type: "true-false-notgiven",
        prompt:
          "The savanna hypothesis stated that upright posture helped hominins see predators in grass.",
        answers: ["True"],
      },
      {
        id: "r4-q10",
        type: "short-answer",
        prompt: "What kind of locomotion involves using four limbs for movement?",
        answers: ["quadrupedal locomotion", "quadrupedal"],
        wordLimit: "No more than two words",
      },
    ],
  },
  {
    id: "psychology-of-deep-focus",
    title: "The cognitive science of deep focus",
    level: "Band 6.0–7.0",
    passage: [
      "In an era characterized by continuous digital notifications and fragmented attention, cognitive psychologists have increasingly turned their attention to the mechanics of sustained concentration, often referred to as deep work or focus.",
      "The human brain is naturally wired to respond to novel stimuli—an evolutionary mechanism that once protected early humans from unexpected environmental threats. Modern digital interfaces exploit this bias by delivering intermittent rewards, such as messages and alerts, which trigger dopamine release in the brain's reward pathways.",
      "Repeated task-switching incurs what psychologists call attention residue. When a worker shifts from a primary task to quickly check an email and returns to the original task, a portion of cognitive capacity remains focused on the secondary task for several minutes. This residue impairs problem-solving efficiency and increases error rates.",
      "Cultivating deep focus requires structured environmental boundaries. Research indicates that establishing dedicated uninterrupted time blocks, removing immediate visual notifications, and practicing single-tasking can restore attentional stamina and boost high-order cognitive performance.",
    ],
    questions: [
      {
        id: "r5-q1",
        type: "short-answer",
        prompt: "What chemical neurotransmitter is released in reward pathways by digital alerts?",
        answers: ["dopamine"],
        wordLimit: "One word",
      },
      {
        id: "r5-q2",
        type: "short-answer",
        prompt:
          "What term do psychologists use to describe the cognitive capacity left on a secondary task?",
        answers: ["attention residue"],
        wordLimit: "No more than two words",
      },
      {
        id: "r5-q3",
        type: "true-false-notgiven",
        prompt: "Task-switching improves problem-solving efficiency and reduces error rates.",
        answers: ["False"],
      },
      {
        id: "r5-q4",
        type: "true-false-notgiven",
        prompt: "The human brain evolved to respond to novel environmental stimuli.",
        answers: ["True"],
      },
      {
        id: "r5-q5",
        type: "multiple-choice",
        prompt: "According to research, what can help restore attentional stamina?",
        options: [
          "Checking notifications every ten minutes",
          "Establishing dedicated uninterrupted time blocks",
          "Working in loud open-plan offices",
          "Multitasking across three projects",
        ],
        answers: ["Establishing dedicated uninterrupted time blocks"],
      },
      {
        id: "r5-q6",
        type: "true-false-notgiven",
        prompt: "Dopamine release causes permanent damage to brain tissue.",
        answers: ["Not Given"],
      },
      {
        id: "r5-q7",
        type: "multiple-choice",
        prompt: "Why did early humans evolve to respond to novel stimuli?",
        options: [
          "To learn new languages faster",
          "As an evolutionary mechanism against environmental threats",
          "To improve memory retention",
          "To communicate with neighbouring tribes",
        ],
        answers: ["As an evolutionary mechanism against environmental threats"],
      },
      {
        id: "r5-q8",
        type: "true-false-notgiven",
        prompt: "Attention residue completely disappears within one second of switching tasks.",
        answers: ["False"],
      },
      {
        id: "r5-q9",
        type: "short-answer",
        prompt: "What practice involves focusing on one task at a time rather than multitasking?",
        answers: ["single-tasking", "single tasking"],
        wordLimit: "No more than two words",
      },
      {
        id: "r5-q10",
        type: "true-false-notgiven",
        prompt: "Digital interfaces deliver intermittent rewards that trigger dopamine pathways.",
        answers: ["True"],
      },
    ],
  },
  {
    id: "microplastics-in-marine-ecosystems",
    title: "Microplastics in global ocean currents",
    level: "Band 6.5–7.5",
    passage: [
      "Microplastics—synthetic polymer particles smaller than five millimetres in diameter—have become pervasive pollutants throughout global marine environments. Originating from fragmented commercial plastics, synthetic clothing fibers, and industrial nurdles, these particles are transported across vast ocean basins by surface currents and deep thermohaline circulation.",
      "The ecological hazard posed by microplastics extends beyond physical ingestion by marine organisms. Because of their hydrophobic surface properties, microplastics readily absorb persistent organic pollutants (POPs) present in seawater, including pesticides and industrial chemicals. When plankton, fish larvae, and seabirds ingest these particles, toxic compounds can accumulate in biological tissues and enter marine food webs.",
      "Addressing oceanic microplastic contamination presents immense technical challenges. Traditional skimming net techniques often remove vital plankton alongside plastic debris, altering marine food chains. Consequently, recent research focuses on bio-remediation using specialized bacterial strains capable of degrading plastic polymers into non-toxic organic compounds.",
    ],
    questions: [
      {
        id: "r6-q1",
        type: "short-answer",
        prompt: "What is the maximum diameter size of microplastic particles?",
        answers: ["five millimetres", "5 mm", "5 millimetres"],
        wordLimit: "No more than two words",
      },
      {
        id: "r6-q2",
        type: "true-false-notgiven",
        prompt:
          "Microplastics absorb persistent organic pollutants due to their hydrophobic surface properties.",
        answers: ["True"],
      },
      {
        id: "r6-q3",
        type: "multiple-choice",
        prompt: "Why can traditional skimming nets be problematic for ocean cleanup?",
        options: [
          "They are too expensive to manufacture.",
          "They remove vital plankton alongside plastic debris.",
          "They collapse under heavy water pressure.",
          "They leak oil into seawater.",
        ],
        answers: ["They remove vital plankton alongside plastic debris."],
      },
      {
        id: "r6-q4",
        type: "short-answer",
        prompt: "What biological research focus aims to degrade plastic polymers using bacteria?",
        answers: ["bio-remediation", "bioremediation"],
        wordLimit: "One word",
      },
      {
        id: "r6-q5",
        type: "true-false-notgiven",
        prompt: "Synthetic clothing fibers are a source of microplastic pollution.",
        answers: ["True"],
      },
      {
        id: "r6-q6",
        type: "true-false-notgiven",
        prompt:
          "All bacterial strains can naturally consume commercial plastics without modification.",
        answers: ["False"],
      },
      {
        id: "r6-q7",
        type: "multiple-choice",
        prompt: "What transports microplastics across ocean basins?",
        options: [
          "Surface currents and thermohaline circulation",
          "Marine mammal migrations",
          "Submarine volcanic eruptions",
          "Commercial fishing trawlers",
        ],
        answers: ["Surface currents and thermohaline circulation"],
      },
      {
        id: "r6-q8",
        type: "true-false-notgiven",
        prompt: "Plankton and fish larvae are immune to toxic compound accumulation.",
        answers: ["False"],
      },
      {
        id: "r6-q9",
        type: "short-answer",
        prompt:
          "What abbreviation refers to toxic persistent organic pollutants absorbed by microplastics?",
        answers: ["POPs"],
        wordLimit: "One word",
      },
      {
        id: "r6-q10",
        type: "true-false-notgiven",
        prompt: "Microplastics are found in deep ocean currents as well as surface waters.",
        answers: ["True"],
      },
    ],
  },
  {
    id: "history-of-early-cartography",
    title: "Maps and the measurement of the earth",
    level: "Band 6.0–7.0",
    passage: [
      "The history of cartography reflects humanity's evolving understanding of space, geography, and planetary geometry. Early clay maps created in ancient Babylonia depicted local agrarian estates and religious cosmologies, but lacked mathematical projections or standardized scales.",
      "The foundation of scientific mapmaking was laid in Hellenistic Alexandria by Eratosthenes and Claudius Ptolemy. Eratosthenes remarkably calculated the Earth's circumference using solar shadow angles in Egypt, achieving an estimate within ten percent of modern measurements. Ptolemy later developed a grid system using latitude and longitude lines, providing a mathematical framework for plotting geographic locations.",
      "During the Age of Discovery in the sixteenth century, cartographers faced the challenge of projecting a three-dimensional sphere onto a flat sheet of paper. In 1569, Flemish cartographer Gerardus Mercator published his famous wall map. By preserving constant compass bearings as straight lines, Mercator's projection revolutionized maritime navigation, despite distorting landmass sizes near polar regions.",
    ],
    questions: [
      {
        id: "r7-q1",
        type: "short-answer",
        prompt: "Which ancient scholar developed a grid system using latitude and longitude lines?",
        answers: ["Claudius Ptolemy", "Ptolemy"],
        wordLimit: "No more than two words",
      },
      {
        id: "r7-q2",
        type: "true-false-notgiven",
        prompt:
          "Eratosthenes' estimate of the Earth's circumference was within ten percent of modern values.",
        answers: ["True"],
      },
      {
        id: "r7-q3",
        type: "multiple-choice",
        prompt: "What key navigational benefit did Mercator's map projection provide?",
        options: [
          "It depicted exact landmass proportions without distortion.",
          "It preserved constant compass bearings as straight lines.",
          "It measured ocean depths accurately.",
          "It calculated international time zones.",
        ],
        answers: ["It preserved constant compass bearings as straight lines."],
      },
      {
        id: "r7-q4",
        type: "short-answer",
        prompt:
          "In which city did Eratosthenes and Ptolemy lay the foundations of scientific cartography?",
        answers: ["Alexandria", "Hellenistic Alexandria"],
        wordLimit: "No more than two words",
      },
      {
        id: "r7-q5",
        type: "true-false-notgiven",
        prompt:
          "Mercator's projection accurately represents the size of landmasses near the equator and poles.",
        answers: ["False"],
      },
      {
        id: "r7-q6",
        type: "true-false-notgiven",
        prompt: "Ancient Babylonian clay maps included precise latitude lines.",
        answers: ["False"],
      },
      {
        id: "r7-q7",
        type: "multiple-choice",
        prompt: "In which century was Mercator's famous wall map published?",
        options: ["14th century", "15th century", "16th century", "17th century"],
        answers: ["16th century"],
      },
      {
        id: "r7-q8",
        type: "true-false-notgiven",
        prompt: "Mercator was born in modern-day France.",
        answers: ["Not Given"],
      },
      {
        id: "r7-q9",
        type: "short-answer",
        prompt:
          "What mathematical challenge did 16th-century cartographers face when mapping the Earth?",
        answers: [
          "projecting a sphere onto flat paper",
          "flat projection",
          "projecting a three-dimensional sphere",
        ],
        wordLimit: "No more than four words",
      },
      {
        id: "r7-q10",
        type: "true-false-notgiven",
        prompt: "Early clay maps in Babylonia often depicted local agrarian estates.",
        answers: ["True"],
      },
    ],
  },
  {
    id: "vertical-farming-technologies",
    title: "Vertical farming and urban agriculture",
    level: "Band 6.0–7.5",
    passage: [
      "As global urban populations continue to expand, traditional agriculture faces unprecedented pressures from soil degradation, water scarcity, and long supply chain emissions. Vertical farming—the practice of growing crops in vertically stacked layers inside controlled indoor environments—has emerged as a technological alternative.",
      "Most commercial vertical farms utilize aeroponic or hydroponic growing systems. Hydroponics submerges plant roots in nutrient-rich water solutions, while aeroponics suspends roots in mid-air, misting them periodically with liquid nutrients. Aeroponic systems use up to ninety-five percent less water than conventional field farming, making them exceptionally resource-efficient.",
      "Light is supplied by specialized LED arrays tuned to specific photosynthetic wavelengths. By controlling light cycles, temperature, and humidity, vertical farms can cultivate crops continuously year-round, unaffected by drought, frost, or seasonal shifts.",
      "However, high energy costs remain a significant economic barrier. Operating climate control systems and powerful artificial lights requires substantial electricity, prompting engineers to integrate rooftop solar installations and energy-efficient LED technology.",
    ],
    questions: [
      {
        id: "r8-q1",
        type: "short-answer",
        prompt:
          "By what percentage can aeroponic growing systems reduce water usage compared to field farming?",
        answers: ["ninety-five percent", "95%", "95 percent"],
        wordLimit: "No more than two words",
      },
      {
        id: "r8-q2",
        type: "true-false-notgiven",
        prompt: "Hydroponics involves misting suspended plant roots in mid-air.",
        answers: ["False"],
      },
      {
        id: "r8-q3",
        type: "multiple-choice",
        prompt: "What is cited as a major economic barrier for vertical farming?",
        options: [
          "Lack of urban land space",
          "High energy costs for lighting and climate control",
          "Inability to grow green leafy vegetables",
          "Government prohibition of indoor crops",
        ],
        answers: ["High energy costs for lighting and climate control"],
      },
      {
        id: "r8-q4",
        type: "short-answer",
        prompt:
          "What light source is tuned to specific photosynthetic wavelengths in indoor farms?",
        answers: ["LED arrays", "specialized LED arrays", "LEDs"],
        wordLimit: "No more than three words",
      },
      {
        id: "r8-q5",
        type: "true-false-notgiven",
        prompt:
          "Controlled vertical farms produce crops year-round regardless of weather conditions.",
        answers: ["True"],
      },
      {
        id: "r8-q6",
        type: "true-false-notgiven",
        prompt: "Vertical farms require rich organic soil to nourish plant roots.",
        answers: ["False"],
      },
      {
        id: "r8-q7",
        type: "multiple-choice",
        prompt: "How does aeroponics deliver nutrients to plant roots?",
        options: [
          "By submerging roots in deep ponds",
          "By misting roots periodically with liquid nutrients",
          "By planting roots in moist sand",
          "By injecting gas into soil beds",
        ],
        answers: ["By misting roots periodically with liquid nutrients"],
      },
      {
        id: "r8-q8",
        type: "true-false-notgiven",
        prompt: "Rooftop solar installations are being integrated to offset electricity costs.",
        answers: ["True"],
      },
      {
        id: "r8-q9",
        type: "true-false-notgiven",
        prompt: "Vertical farms produce higher yields of root vegetables than leafy greens.",
        answers: ["Not Given"],
      },
      {
        id: "r8-q10",
        type: "short-answer",
        prompt:
          "What term refers to growing crops in vertically stacked layers in controlled buildings?",
        answers: ["vertical farming"],
        wordLimit: "No more than two words",
      },
    ],
  },
  {
    id: "navigational-mechanisms-bird-migration",
    title: "Navigational mechanisms in migratory birds",
    level: "Band 6.5–7.5",
    passage: [
      "Every autumn, billions of migratory birds undertake extraordinary long-distance journeys across oceans and continents, returning to precise breeding grounds months later. For decades, ornithologists have sought to understand the neurological and sensory mechanisms enabling such flawless navigation.",
      "Research shows birds rely on a multi-sensory navigation system. During daytime flight, many species utilize a solar compass, compensating for the sun's movement across the sky using their internal biological clock. At night, nocturnal migrants navigate by star constellations, orienting relative to the center of rotation in the northern night sky.",
      "The most remarkable discovery involves magnetoreception—the ability to perceive Earth's magnetic field lines. Cryptochromes, specialized light-sensitive proteins in avian eyes, undergo quantum chemical reactions when exposed to blue light, allowing birds to visual perceive magnetic field inclinations as subtle patterns of light and shade across their field of vision.",
    ],
    questions: [
      {
        id: "r9-q1",
        type: "short-answer",
        prompt:
          "What light-sensitive proteins in avian eyes undergo quantum reactions for magnetoreception?",
        answers: ["cryptochromes", "Cryptochromes"],
        wordLimit: "One word",
      },
      {
        id: "r9-q2",
        type: "true-false-notgiven",
        prompt:
          "Nocturnal migrants navigate at night by orienting relative to star constellations.",
        answers: ["True"],
      },
      {
        id: "r9-q3",
        type: "multiple-choice",
        prompt: "How do daytime migrating birds compensate for the sun's movement?",
        options: [
          "By adjusting flight altitude",
          "By using their internal biological clock",
          "By following coastal landmarks",
          "By flying only at noon",
        ],
        answers: ["By using their internal biological clock"],
      },
      {
        id: "r9-q4",
        type: "short-answer",
        prompt: "What wavelength color of light triggers cryptochrome reactions in bird eyes?",
        answers: ["blue light", "blue"],
        wordLimit: "No more than two words",
      },
      {
        id: "r9-q5",
        type: "true-false-notgiven",
        prompt: "Birds perceive magnetic field inclinations as patterns of sound.",
        answers: ["False"],
      },
      {
        id: "r9-q6",
        type: "true-false-notgiven",
        prompt: "Young birds learn migratory routes from older flock leaders.",
        answers: ["Not Given"],
      },
      {
        id: "r9-q7",
        type: "multiple-choice",
        prompt: "What term describes the biological ability to sense magnetic fields?",
        options: ["Echolocation", "Magnetoreception", "Thermoregulation", "Phototropism"],
        answers: ["Magnetoreception"],
      },
      {
        id: "r9-q8",
        type: "true-false-notgiven",
        prompt: "Migratory birds rely on a single sensory compass rather than multiple systems.",
        answers: ["False"],
      },
      {
        id: "r9-q9",
        type: "short-answer",
        prompt: "What celestial body is used by daytime migrating birds for direction?",
        answers: ["the sun", "sun"],
        wordLimit: "No more than two words",
      },
      {
        id: "r9-q10",
        type: "true-false-notgiven",
        prompt: "Migratory birds return to precise breeding grounds after long journeys.",
        answers: ["True"],
      },
    ],
  },
  {
    id: "light-pollution-nocturnal-ecosystems",
    title: "Light pollution and nocturnal ecosystems",
    level: "Band 6.0–7.0",
    passage: [
      "The rapid expansion of artificial light at night (ALAN) has fundamentally altered the natural light cycles that have governed terrestrial and aquatic ecosystems for millions of years. Streetlights, architectural floodlights, and illuminated signage now light up vast regions, obscuring night skies.",
      "For nocturnal species, darkness is an essential ecological resource. Artificial glare disrupts lunar navigation in sea turtle hatchlings, which naturally move toward the bright ocean horizon reflected by starlight. Illuminated coastal roads lure hatchlings inland toward traffic, resulting in heavy mortality rates.",
      "Insect populations suffer catastrophic declines under artificial lighting. Moths and beetles exhaust themselves flying in circles around outdoor lamps—a phenomenon known as positive phototaxis—leaving them vulnerable to predators or death by exhaustion before mating.",
      "Mitigation strategies focus on dark-sky urban planning. Installing fully shielded fixtures that direct light downwards, introducing motion sensors, and switching to warmer amber LED wavelengths significantly reduce ecological disruption while preserving public safety.",
    ],
    questions: [
      {
        id: "r10-q1",
        type: "short-answer",
        prompt: "What acronym refers to artificial light at night in environmental research?",
        answers: ["ALAN"],
        wordLimit: "One word",
      },
      {
        id: "r10-q2",
        type: "short-answer",
        prompt:
          "What scientific term describes the movement of moths towards outdoor light sources?",
        answers: ["positive phototaxis", "phototaxis"],
        wordLimit: "No more than two words",
      },
      {
        id: "r10-q3",
        type: "true-false-notgiven",
        prompt: "Artificial glare lures sea turtle hatchlings inland toward roads.",
        answers: ["True"],
      },
      {
        id: "r10-q4",
        type: "multiple-choice",
        prompt: "Which fixture design helps reduce light pollution by directing light downwards?",
        options: [
          "Unshielded glass globes",
          "Fully shielded fixtures",
          "High-powered laser spotlights",
          "Submersible lamps",
        ],
        answers: ["Fully shielded fixtures"],
      },
      {
        id: "r10-q5",
        type: "short-answer",
        prompt:
          "What color wavelength of LED lighting is recommended to reduce ecological disruption?",
        answers: ["warmer amber", "amber", "amber LED"],
        wordLimit: "No more than two words",
      },
      {
        id: "r10-q6",
        type: "true-false-notgiven",
        prompt: "Nocturnal animals benefit from high levels of artificial glare.",
        answers: ["False"],
      },
      {
        id: "r10-q7",
        type: "true-false-notgiven",
        prompt: "International laws prohibit outdoor advertising lights after midnight.",
        answers: ["Not Given"],
      },
      {
        id: "r10-q8",
        type: "multiple-choice",
        prompt: "What natural horizon light source do sea turtle hatchlings naturally follow?",
        options: [
          "Starlight reflected on the ocean",
          "Coastal streetlight glare",
          "Ship headlights",
          "Lighthouse beams",
        ],
        answers: ["Starlight reflected on the ocean"],
      },
      {
        id: "r10-q9",
        type: "true-false-notgiven",
        prompt: "Motion sensors can help reduce unnecessary artificial lighting.",
        answers: ["True"],
      },
      {
        id: "r10-q10",
        type: "short-answer",
        prompt:
          "What essential resource is obscured for nocturnal wildlife by artificial lighting?",
        answers: ["darkness", "natural darkness"],
        wordLimit: "No more than two words",
      },
    ],
  },
];

/**
 * Academic Reading raw→band conversion (out of 40), from widely published IELTS
 * guidance. Ordered high→low; `rawToBand` scales shorter practice papers to /40
 * before lookup.
 *
 * @see https://www.ielts.org/for-test-takers/how-ielts-is-scored
 */
export const READING_BAND_TABLE: BandTable = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [33, 7.5],
  [30, 7],
  [27, 6.5],
  [23, 6],
  [19, 5.5],
  [15, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [3, 2],
  [2, 1.5],
  [1, 1],
];

export function getReadingTest(id: string): ReadingTest | undefined {
  return READING_TESTS.find((test) => test.id === id);
}

/** Deterministic pick from a seed (e.g. a session id); no seed → the first test. */
export function pickReadingTest(seed?: string): ReadingTest {
  if (!seed) return READING_TESTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return READING_TESTS[Math.abs(hash) % READING_TESTS.length];
}
