# Drill Room · JDCW IB

Daily practice app for the UBC JDCW International Business team: a daily case drill (Brainstorm + Rec and Quant), three-stage flashcards, GTM Fit country scoring with a heat map, a Daily 3 checklist with rewards, a leaderboard, awards and a team page.

Live app: https://claude.ai/artifact/P9fUomxic6Fg5iSH7MwjjQ

## How it runs

The app is a single `index.html` built for the claude.ai artifact runtime. It uses three capabilities from `window.claude.use(...)`:

- `db`: shared team data (drills, submissions, decks, GTM Fit cases, members)
- `user`: each person's name and email for registration
- `sample`: AI generation and grading, run on each visitor's own Claude account

Opened as a plain web page (GitHub Pages, Netlify), it loads but cannot save, generate or grade, because those capabilities only exist on claude.ai. Running it standalone would need a backend (for example Supabase) plus an Anthropic API key, and every AI call would bill that key instead of each user's Claude.

## Files

- `index.html`: the whole app (HTML, CSS, JS)
- `world.json`: world map paths for the GTM Fit heat map (Natural Earth via world-atlas, projected with d3-geo)
- `bg/`: hero background photos from Unsplash, one bank per country, rotated daily to match the day's case country
- `img/`: team photos, not committed (kept out of this public repo for privacy). Add `p1.jpg`… and the `a_*.jpg` avatar crops locally if you need them.

## Photo credits (Unsplash)

- Germany: [Florian Wehde](https://unsplash.com/@florianwehde?utm_source=drillroom&utm_medium=referral), [Adam Vradenburg](https://unsplash.com/@vradenburg?utm_source=drillroom&utm_medium=referral)
- France: [Alexander Kagan](https://unsplash.com/@allewollenalex?utm_source=drillroom&utm_medium=referral), [Luca Micheli](https://unsplash.com/@lucamicheli?utm_source=drillroom&utm_medium=referral), [Rares Stan](https://unsplash.com/@rrs300?utm_source=drillroom&utm_medium=referral)
- United Kingdom: [Benjamin Davies](https://unsplash.com/@bendavisual?utm_source=drillroom&utm_medium=referral), [Marcin Nowak](https://unsplash.com/@marcin?utm_source=drillroom&utm_medium=referral), [David Garrick - Bangbola](https://unsplash.com/@david_garrick_bangbola?utm_source=drillroom&utm_medium=referral)
- Japan: [Louie Martinez](https://unsplash.com/@thetalkinglens?utm_source=drillroom&utm_medium=referral), [Marek Okon](https://unsplash.com/@marekokon?utm_source=drillroom&utm_medium=referral), [Cem Ersozlu](https://unsplash.com/@cemersozlu?utm_source=drillroom&utm_medium=referral)
- China: [Edward He](https://unsplash.com/@bingham008?utm_source=drillroom&utm_medium=referral), [Zhou Xian](https://unsplash.com/@zhou_xian?utm_source=drillroom&utm_medium=referral), [Lijian (Richard) Zhu](https://unsplash.com/@cxzydn?utm_source=drillroom&utm_medium=referral)
- India: [Previn Samuel](https://unsplash.com/@samuelprevin?utm_source=drillroom&utm_medium=referral), [Satyajeet Mazumdar](https://unsplash.com/@satyajeetm?utm_source=drillroom&utm_medium=referral), [Uday Sankar Yerramilli](https://unsplash.com/@usyerramilli?utm_source=drillroom&utm_medium=referral)
- Brazil: [Agustin Diaz Gargiulo](https://unsplash.com/@agustindiazg?utm_source=drillroom&utm_medium=referral), [Raphael Nogueira](https://unsplash.com/@phaelnogueira?utm_source=drillroom&utm_medium=referral), [Rafael Peier](https://unsplash.com/@rafaelpeier?utm_source=drillroom&utm_medium=referral)
- Mexico: [Diwei Zhu](https://unsplash.com/@chwdy?utm_source=drillroom&utm_medium=referral), [John Kleinad](https://unsplash.com/@john_kleinad?utm_source=drillroom&utm_medium=referral), [Jesus Herrera](https://unsplash.com/@camhph?utm_source=drillroom&utm_medium=referral)
- United States: [Luca Bravo](https://unsplash.com/@lucabravo?utm_source=drillroom&utm_medium=referral), [Jermaine Ee](https://unsplash.com/@eejermaine?utm_source=drillroom&utm_medium=referral), [Tintinburgh](https://unsplash.com/@tintinburgh?utm_source=drillroom&utm_medium=referral)
- South Korea: [JIWON KANG](https://unsplash.com/@jiwon_kang?utm_source=drillroom&utm_medium=referral), [NK Lee](https://unsplash.com/@nlee02?utm_source=drillroom&utm_medium=referral), [NK Lee](https://unsplash.com/@nlee02?utm_source=drillroom&utm_medium=referral)
- Vietnam: [Peter Nguyen](https://unsplash.com/@peterng1618?utm_source=drillroom&utm_medium=referral), [Tron Le](https://unsplash.com/@tronle_sg?utm_source=drillroom&utm_medium=referral), [CreateTravel.tv](https://unsplash.com/@greenmarketing?utm_source=drillroom&utm_medium=referral)
- Singapore: [Hu Chen](https://unsplash.com/@huchenme?utm_source=drillroom&utm_medium=referral), [Swapnil Bapat](https://unsplash.com/@unfilteredkopi?utm_source=drillroom&utm_medium=referral), [Mike Enerio](https://unsplash.com/@mikeenerio?utm_source=drillroom&utm_medium=referral)
- United Arab Emirates: [David Rodrigo](https://unsplash.com/@david__r?utm_source=drillroom&utm_medium=referral), [ZQ Lee](https://unsplash.com/@zqlee?utm_source=drillroom&utm_medium=referral), [Vishnu Kalanad](https://unsplash.com/@vishnukalanad?utm_source=drillroom&utm_medium=referral)
- Australia: [Caleb](https://unsplash.com/@calebrussell?utm_source=drillroom&utm_medium=referral), [April Pethybridge](https://unsplash.com/@apriiil?utm_source=drillroom&utm_medium=referral), [Arvin Wiyono](https://unsplash.com/@awiy1?utm_source=drillroom&utm_medium=referral)
- Chile: [Chalo Gallardo](https://unsplash.com/@chalogallardo?utm_source=drillroom&utm_medium=referral), [Francisco Kemeny](https://unsplash.com/@franciscokemeny?utm_source=drillroom&utm_medium=referral), [Francisco Kemeny](https://unsplash.com/@franciscokemeny?utm_source=drillroom&utm_medium=referral)
- South Africa: [Tobias Reich](https://unsplash.com/@electerious?utm_source=drillroom&utm_medium=referral), [Marlin Clark](https://unsplash.com/@marlinclark?utm_source=drillroom&utm_medium=referral), [Adrien Olichon](https://unsplash.com/@adrienolichon?utm_source=drillroom&utm_medium=referral)
