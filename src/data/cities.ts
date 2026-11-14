/**
 * City pages.
 *
 * PROPOSED LIST, published at Dan's direction on 2026-11-14, pending Andrew's confirmation.
 * Chosen around Andrew's 757/804 Virginia base and the main markets in NJ, CT and MA.
 * To remove a city, set `published: false` (or delete it) and push; its page, sitemap
 * entry and links disappear on the next build.
 *
 * Each page states coverage must be confirmed by phone and never claims a local office.
 * Local details are general, verifiable characteristics (coastal exposure, housing age).
 */
import type { City } from './serviceAreas';
import type { StateCode } from '../lib/site';

const c = (slug: string, name: string, county: string, intro: string, localNotes: string[], faqs: { q: string; a: string }[]): City => ({
  slug,
  name,
  county,
  published: true,
  intro,
  localNotes,
  faqs,
});

const confirm = (town: string) => ({
  q: `Do you serve all of ${town}?`,
  a: `We serve homeowners in and around ${town}. Call or text (757) 589-0783 or send a request with your address and we will confirm we can reach you before anything is booked.`,
});

export const CITY_DATA: Record<StateCode, City[]> = {
  VA: [
    c('virginia-beach', 'Virginia Beach', 'Independent city',
      'Virginia Beach chimneys live with salt air, humidity and storms that push rain sideways off the ocean and the bay. That combination is hard on metal: chimney caps, chase covers and flashing corrode faster here than they do inland. First Chimney helps Virginia Beach homeowners keep their chimneys dry, clean and safe.',
      [
        'Many homes in the area have factory-built fireplaces inside framed chases. A rusted or flat chase cover is one of the most common leak sources we look for.',
        'Salt air shortens the life of painted steel caps. Stainless caps and covers hold up far better near the water.',
        'Tropical storms and nor\'easters test flashing. If a stain shows up near the chimney after a big storm, have it checked before the next one.',
      ],
      [confirm('Virginia Beach'), { q: 'Why does my chimney smell in the summer?', a: 'Humidity pulls creosote odor out of the flue and into the house. A cleaning plus a damper or cap that seals well usually fixes it.' }]),
    c('norfolk', 'Norfolk', 'Independent city',
      'Norfolk has neighborhoods full of early twentieth-century brick homes, and many still have their original masonry chimneys. Those chimneys have stood up to a century of coastal weather, and most of them need regular attention to keep doing it. First Chimney inspects, cleans and repairs chimneys for Norfolk homeowners.',
      [
        'Older masonry chimneys often have clay tile liners that crack with age. An inspection tells you whether yours is still sound before you light the first fire.',
        'Mortar on century-old chimneys is often softer than modern mixes, so repairs should be compatible with the original masonry.',
        'High humidity and heavy rain make crowns and caps especially important for keeping water out of the flue.',
      ],
      [confirm('Norfolk'), { q: 'My house is over 100 years old. Is the fireplace safe to use?', a: 'It may be, but it should be inspected first. Old liners, gaps in the firebox and missing caps are common in older homes and are all checked during an inspection.' }]),
    c('chesapeake', 'Chesapeake', 'Independent city',
      'Chesapeake mixes newer subdivisions with older homes on larger lots near woods and wetlands. That means two very different chimney problems: worn-out prefab fireplaces in newer homes, and animals and debris getting into uncapped flues out where the trees are. First Chimney handles both for Chesapeake homeowners.',
      [
        'Birds, squirrels and raccoons look for open flues near wooded areas. A properly fitted cap keeps them out and keeps rain out too.',
        'Prefab fireplaces in homes from the 1980s and 1990s may have worn parts, rusted chase tops or damaged refractory panels worth checking.',
        'Summer humidity brings out creosote smells. Regular cleaning keeps it under control.',
      ],
      [confirm('Chesapeake'), { q: 'I hear noises in my chimney. What should I do?', a: 'Do not light a fire. Animals may be nesting in the flue. Call us to check it, and we can install a cap afterward so it does not happen again.' }]),
    c('richmond', 'Richmond', 'Independent city',
      'Richmond\'s historic neighborhoods are full of rowhouses and older homes with more than one fireplace, many originally built to burn coal. Those small coal fireplaces were never designed for big wood fires, so it pays to know what you have before you use it. First Chimney helps Richmond homeowners use their fireplaces safely.',
      [
        'Many older Richmond homes have small coal-burning fireplaces. They usually need an inspection, and sometimes a liner or conversion, before burning wood or adding gas logs.',
        'Homes with several fireplaces often have several flues in one chimney. Each one should be checked, including the ones you do not use.',
        'Richmond sees more freeze-thaw cycles than the coast, which shows up as crumbling mortar and spalling brick on the top of the chimney.',
      ],
      [confirm('Richmond'), { q: 'Can I burn wood in my old coal fireplace?', a: 'Often not safely as-is. Coal fireplaces are shallow and were built for a different fuel. An inspection will tell you what it would take to use it for wood, gas logs or an insert.' }]),
    c('williamsburg', 'Williamsburg', 'Independent city',
      'Williamsburg is known for colonial architecture, and many homes in and around it, old and new, are built with large brick chimneys and multiple fireplaces. Big chimneys mean more masonry to maintain and more flues to keep clean. First Chimney helps Williamsburg-area homeowners care for them properly.',
      [
        'Large colonial-style chimneys often have multiple flues. Each flue should be inspected and capped.',
        'Brick and mortar repairs on traditional-style homes should match the look of the original masonry as closely as possible.',
        'Homes that are not lived in year-round benefit from an inspection before the first visit of the season.',
      ],
      [confirm('Williamsburg'), { q: 'How do I keep a big brick chimney in good shape?', a: 'Annual inspection, a sound crown, caps on every flue, and fixing mortar joints early. Small repairs on a large chimney save a lot of money later.' }]),
  ],
  NJ: [
    c('toms-river', 'Toms River', 'Ocean County',
      'Toms River sits right on the Jersey Shore, where salt air, coastal storms and wind-driven rain put chimneys through a lot. Many homes in the area were repaired, raised or rebuilt after Superstorm Sandy, and chimneys and chases do not always get the attention they need in that process. First Chimney helps Toms River homeowners keep their chimneys watertight and safe.',
      [
        'Coastal homes see faster corrosion of caps, chase covers and flashing. Stainless parts last longest near the water.',
        'Homes that were raised or rebuilt may have new chases or vent runs that should be checked as a complete system.',
        'Storm-driven leaks usually trace back to flashing or the crown, not the spot where the stain appears inside.',
      ],
      [confirm('Toms River'), { q: 'My chimney only leaks during big storms. Why?', a: 'Wind-driven rain gets into weak flashing, a cracked crown or a missing cap that normal rain does not reach. We trace the entry point before recommending a fix.' }]),
    c('cherry-hill', 'Cherry Hill', 'Camden County',
      'Cherry Hill has a large share of mid-century homes with masonry chimneys, and many of those chimneys do double duty, venting both a fireplace and a furnace or water heater. When heating equipment changes, the chimney often needs a closer look. First Chimney inspects and repairs chimneys for Cherry Hill homeowners.',
      [
        'If your furnace or water heater vents into the chimney, the flue has to be the right size for that appliance. Replacing equipment is a good time to have it checked.',
        'Gas appliances produce acidic condensation that can wear out old clay liners from the inside.',
        'Mid-century chimneys are now old enough that mortar and crowns often need repair.',
      ],
      [confirm('Cherry Hill'), { q: 'I replaced my furnace. Does my chimney need anything?', a: 'Possibly. A new, more efficient furnace may need a different flue or a liner. An inspection confirms the venting is safe for the new equipment.' }]),
    c('princeton', 'Princeton', 'Mercer County',
      'Princeton has many older and historic homes with stone and brick chimneys, often on slate or other premium roofs that need careful handling. Chimney work here has to protect both the chimney and the roof around it. First Chimney works carefully for Princeton homeowners who want it done right.',
      [
        'Slate roofs are easy to damage. Roof access and flashing work on older homes should be done with care for the roofing around the chimney.',
        'Stone chimneys need compatible mortar and careful repointing to keep their character.',
        'Older homes often have multiple flues, some long unused, that still need caps and inspection.',
      ],
      [confirm('Princeton'), { q: 'Will you damage my slate roof?', a: 'We take care to protect the roof around the chimney and will tell you upfront if a job needs a roofing specialist alongside us.' }]),
    c('morristown', 'Morristown', 'Morris County',
      'Morristown and the surrounding Morris County towns have a deep stock of colonial-era and Victorian homes, along with colder, snowier winters than the shore. Older masonry and real winter weather make regular chimney care important. First Chimney helps Morristown homeowners stay ahead of it.',
      [
        'Snow and ice around the chimney base stress the flashing and roof joint, and leaks often appear during thaws.',
        'Victorian and colonial homes often have decorative or tall chimneys that need careful masonry repair.',
        'Homes heated with wood stoves through the winter build creosote quickly and may need more than one cleaning a season.',
      ],
      [confirm('Morristown'), { q: 'When should I get my chimney checked?', a: 'Late summer or early fall, before the first cold snap. That leaves time to handle repairs before you need the fireplace.' }]),
    c('montclair', 'Montclair', 'Essex County',
      'Montclair is known for large early twentieth-century homes, with Victorian, Tudor and Colonial Revival houses that often have several fireplaces and tall masonry chimneys. Keeping all of that sound takes regular inspection and the right kind of repairs. First Chimney serves Montclair homeowners with careful, documented work.',
      [
        'Multiple fireplaces usually mean multiple flues. Each one needs an inspection, even the ones you never use.',
        'Tall chimneys on older homes take more wind and weather, so crowns and top courses wear first.',
        'Older fireplaces may have dampers that no longer seal. A top-sealing damper can cut drafts significantly.',
      ],
      [confirm('Montclair'), { q: 'One of my fireplaces is never used. Does it matter?', a: 'Yes. Unused flues still take on water, debris and animals. An inspection and a cap keep it from becoming a problem for the rest of the chimney.' }]),
  ],
  CT: [
    c('hartford', 'Hartford', 'Hartford County',
      'Hartford has a large stock of older multi-family homes and early twentieth-century houses, many with masonry chimneys that vent heating equipment as well as fireplaces. In a multi-unit building, a safe chimney protects every household in it. First Chimney inspects and repairs chimneys for Hartford-area property owners.',
      [
        'Chimneys venting boilers and water heaters should be checked when equipment is replaced and on a regular schedule.',
        'Cold Connecticut winters bring repeated freeze-thaw cycles that crack crowns and loosen mortar.',
        'Multi-family buildings often have several flues in one stack, each serving a different unit.',
      ],
      [confirm('Hartford'), { q: 'Do you work on multi-family buildings?', a: 'Yes. We inspect each flue and give owners clear, documented findings for each unit\'s appliance or fireplace.' }]),
    c('new-haven', 'New Haven', 'New Haven County',
      'New Haven combines historic homes that are well over a century old with exposure to storms off Long Island Sound. Old masonry plus coastal weather means water is the main thing to manage. First Chimney helps New Haven homeowners keep their chimneys dry and sound.',
      [
        'Coastal storms push rain into flashing and crowns. Leaks after big storms are worth tracing right away.',
        'Century-old chimneys may have cracked or missing liners that are only visible from inside the flue.',
        'Masonry repairs on historic homes should use mortar compatible with the original.',
      ],
      [confirm('New Haven'), { q: 'How do I know if my liner is cracked?', a: 'You usually cannot see it from below. A camera scan of the flue during a Level 2 inspection shows the condition of the liner along its length.' }]),
    c('stamford', 'Stamford', 'Fairfield County',
      'Stamford mixes older colonials, mid-century homes and newer construction along the Connecticut coast. That means everything from century-old masonry chimneys to factory-built fireplaces, all dealing with nor\'easters and salt air. First Chimney serves Stamford homeowners with the right fix for whatever they have.',
      [
        'Factory-built fireplaces have different parts and failure points than masonry ones, especially chase covers and refractory panels.',
        'Coastal exposure shortens the life of painted metal caps and flashing.',
        'Fairfield County homeowners often want a fireplace refresh. Our Build Your Fireplace tool is a good place to start planning one.',
      ],
      [confirm('Stamford'), { q: 'My prefab fireplace looks worn. Can it be repaired?', a: 'Often yes. Refractory panels, chase covers and some components can be replaced. If the unit is past repair, we will explain the options.' }]),
    c('fairfield', 'Fairfield', 'Fairfield County',
      'Fairfield is a shoreline town full of colonial-style homes with brick chimneys, sitting right in the path of storms off Long Island Sound. Salt air and wind-driven rain are the chimney\'s main enemies here. First Chimney helps Fairfield homeowners stop water before it does damage.',
      [
        'Shoreline homes benefit from stainless caps and well-sealed crowns.',
        'Breathable masonry water repellent can help brick shed rain without trapping moisture inside.',
        'Colonial-style chimneys often have multiple flues that each need caps.',
      ],
      [confirm('Fairfield'), { q: 'Should I waterproof my chimney?', a: 'On exposed coastal chimneys, a breathable masonry water repellent can help. Paint and non-breathable sealers should be avoided because they trap moisture in the brick.' }]),
    c('glastonbury', 'Glastonbury', 'Hartford County',
      'Glastonbury and the surrounding Hartford County towns have plenty of homes that burn wood through the winter, from open fireplaces to stoves and inserts. Heavy burning builds creosote fast, and long cold winters are hard on masonry. First Chimney helps Glastonbury homeowners burn safely all season.',
      [
        'Wood stoves and inserts used daily can need cleaning more than once a winter.',
        'Burning dry, seasoned wood reduces creosote buildup significantly.',
        'Snow and ice around chimney bases are a common cause of late-winter leaks.',
      ],
      [confirm('Glastonbury'), { q: 'How often should a wood stove chimney be cleaned?', a: 'At least once a year, and more often if you burn daily. An inspection shows how fast buildup is forming so you know the right schedule for your home.' }]),
  ],
  MA: [
    c('boston', 'Boston', 'Suffolk County',
      'Boston\'s brownstones, triple-deckers and older single-family homes are full of fireplaces, many of them unused for decades or converted along the way. Dense neighborhoods also make roof access a real consideration. First Chimney helps Boston-area homeowners find out what they have and use it safely.',
      [
        'Many older Boston fireplaces have not been used in years. An inspection is the first step before lighting one.',
        'Shared walls and tight lots can make chimney access more involved. We plan access before the visit.',
        'Nor\'easters and repeated freeze-thaw cycles wear down crowns and top courses on older masonry.',
      ],
      [confirm('Boston'), { q: 'Can I start using a fireplace that has not been used in decades?', a: 'Only after an inspection. Old fireplaces may have blockages, missing liners or damage that is not visible from the room.' }]),
    c('worcester', 'Worcester', 'Worcester County',
      'Worcester is famous for its triple-deckers, and its inland winters are colder and snowier than the coast. Older multi-family homes with shared chimneys, plus long heating seasons, make regular chimney care especially important here. First Chimney serves Worcester-area property owners.',
      [
        'Triple-deckers often have chimneys venting heating equipment for multiple units.',
        'Long, cold winters mean more freeze-thaw damage to crowns and mortar.',
        'Heavy snow loads stress the flashing and roof-to-chimney joint.',
      ],
      [confirm('Worcester'), { q: 'Does a chimney that only vents a boiler need inspection?', a: 'Yes. Appliance flues can corrode, block or separate. Annual inspection is recommended for every chimney and vent.' }]),
    c('springfield', 'Springfield', 'Hampden County',
      'Springfield and the Pioneer Valley have plenty of older homes and plenty of households that heat with wood. That means chimneys working hard through long winters and creosote building up quickly. First Chimney helps Springfield-area homeowners keep their chimneys clean and sound.',
      [
        'Homes heating with wood often need cleaning every season, sometimes more.',
        'Older chimneys may not have a liner suited to a modern stove or insert.',
        'Inland winters bring more freeze-thaw cycles, so mortar and crown checks matter.',
      ],
      [confirm('Springfield'), { q: 'Do I need a liner for my wood stove insert?', a: 'Inserts generally need a properly sized stainless steel liner running to the top of the chimney. We inspect the flue and tell you what your setup needs.' }]),
    c('plymouth', 'Plymouth', 'Plymouth County',
      'Plymouth combines some of the oldest homes in the country with newer neighborhoods, all exposed to coastal weather and nor\'easters. Salt air, wind-driven rain and older masonry make water the main thing to watch. First Chimney helps Plymouth homeowners keep chimneys sound and dry.',
      [
        'Antique homes may have chimneys built long before modern liners, so inspection comes first.',
        'Coastal exposure means caps, flashing and chase covers wear faster.',
        'Newer homes with factory-built fireplaces need their own kind of maintenance, especially chase covers.',
      ],
      [confirm('Plymouth'), { q: 'Can you work on an antique chimney?', a: 'Yes. On older chimneys we focus on compatible repairs that respect the original masonry, and we will tell you if a historic restoration specialist is the better fit.' }]),
    c('newton', 'Newton', 'Middlesex County',
      'Newton has a large stock of Victorian and colonial homes, many with multiple fireplaces, tall chimneys and slate roofs. Keeping those chimneys in shape takes careful masonry work and respect for the roof around them. First Chimney serves Newton homeowners with documented, careful work.',
      [
        'Multiple fireplaces mean multiple flues, each needing inspection and a cap.',
        'Slate roofs need careful handling during chimney and flashing work.',
        'Older dampers often stop sealing. A top-sealing damper can stop cold drafts.',
      ],
      [confirm('Newton'), { q: 'Why is my house drafty near the fireplace?', a: 'A worn throat damper often lets warm air escape and cold air in. A top-sealing damper or glass doors can make a noticeable difference.' }]),
  ],
};
