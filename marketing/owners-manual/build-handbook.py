"""Build the Team Handbook (for new technicians, reps, canvassers and office staff) from manual.html.

It reuses the manual's chapters so the two never drift apart, and adds a welcome page and a
safety sheet to sign. Usage: python build-handbook.py  (then render with render.sh)
"""
import re
from pathlib import Path

HERE = Path(__file__).parent
manual = (HERE / "manual.html").read_text(encoding="utf-8")

head = manual[: manual.index("<body>") + len("<body>")]
head = head.replace("<title>First Chimney Contracting: Owner's Operating Manual</title>", "<title>First Chimney Contracting: Team Handbook</title>")
head = head.replace("Owner's Operating Manual\"; font", "Team Handbook\"; font")

sections = re.findall(r'<section class="chapter(?: (?:fit|follow))?">.*?</section>', manual, flags=re.S)
by_num = {}
for sec in sections:
    m = re.search(r'Chapter (\d+)', sec)
    if m:
        by_num[int(m.group(1))] = sec

KEEP = [1, 5, 6, 7, 8, 11, 16]

cover = """
<section class="cover">
  <img class="hero" src="../../public/media/team/andrew-cleaning-fireplace-chimney-brush.webp" alt="">
  <div class="fade"></div>
  <div class="text">
    <img class="logo" src="../../public/brand/logo-light.png" alt="First Chimney Contracting">
    <div class="kicker">Team Handbook</div>
    <h1>How we work at First Chimney.</h1>
    <p class="sub">For every technician, helper, mason, sales rep, canvasser and office teammate. Read it in your first week and keep it in the truck.</p>
    <div class="meta"><div><b>Edition 1</b>November 2026</div><div><b>Owner</b>Andrew Paterini</div><div><b>Questions</b>(757) 589-0783</div></div>
  </div>
</section>"""

welcome = """
<section class="chapter">
  <div class="chapter-head"><div class="num">Welcome</div><h1>Welcome to the crew.</h1>
  <p>You joined a company built on one idea: treat every home like it is your own, and tell people the truth about their chimney.</p></div>
  <div class="cols">
    <div>
      <h3>Your first week</h3>
      <ul class="check">
        <li>Day 1: safety sheet signed, truck walk-through, shadow Andrew</li>
        <li>Day 2–3: set up and protect work areas, take the 12-photo set</li>
        <li>Day 4–5: read chapters 1, 6 and 8 of this handbook; ask questions</li>
        <li>Install the CRM app and learn to log photos and notes</li>
      </ul>
      <h3>How you will be measured</h3>
      <ul><li>Reliability: on time, prepared, does what you said</li><li>Safety: zero shortcuts</li><li>Customer respect: clean, polite, honest</li><li>Quality: no callbacks</li><li>Growth: learning something new every week</li></ul>
    </div>
    <img class="photo" style="height:3.6in" src="../../public/media/team/andrew-paterini-owner-portrait-sm.webp" alt="">
  </div>
  <h2>Safety rules (sign below)</h2>
  <ol>
    <li>Ladders at a 4:1 angle, 3 feet above the roof edge, secured. Inspect before every use.</li>
    <li>Fall protection on steep, wet or high roofs, and wherever the work is 6 feet or more above a lower level.</li>
    <li>No roof work in ice, high wind, lightning or heavy rain.</li>
    <li>Respirator and eye protection when sweeping or handling soot and creosote.</li>
    <li>Confirm a fireplace or stove is cold before working. Shut off and verify gas before touching a gas appliance.</li>
    <li>Report every injury, near miss and property damage the same day. No blame for reporting.</li>
    <li>Never drive tired or distracted. Phones down while driving.</li>
  </ol>
  <p style="margin-top:18pt">Name: ______________________________ &nbsp; Signature: ______________________________ &nbsp; Date: ____________</p>
</section>"""

body = cover + welcome + "".join(by_num[n] for n in KEEP if n in by_num)
out = head + body + "\n</body>\n</html>\n"
(HERE / "team-handbook.html").write_text(out, encoding="utf-8")
print("team-handbook.html written with chapters", [n for n in KEEP if n in by_num])
