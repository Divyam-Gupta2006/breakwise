import Link from "next/link";
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
const F = [
  ["⏱", "Break built in", "Choose your focus time and your break together. The break is already waiting when you start."],
  ["🌿", "Screen-free ideas", "When the timer rings, get a simple suggestion that is not another feed."],
  ["🙂", "Reflect, never judged", "Say how a session felt in a word. No scores, no streaks, no guilt."],
  ["🔒", "Private by design", "Nothing is saved or sent anywhere. Close the page and it is gone."],
];
const S = [["Plan", "Name what you will study and pick focus and break lengths."], ["Focus", "A calm timer shows your progress and what is coming next."], ["Rest", "Step away with a screen-free idea until the break ends."], ["Reflect", "Note how it felt, then plan the next round if you want."]];
export default function Home() {
  return (<>
    <section className="hero"><div className="wrap">
      <div>
        <h1>Study hard.<br />Rest on purpose.</h1>
        <p className="lead">BreakWise plans your break the moment you plan your study session, so rest actually refreshes you instead of turning into an hour of scrolling.</p>
        <div className="row"><Link className="btn mint" href="/app">Start a session</Link><Link className="btn ghost" href="#how">See how it works</Link></div>
      </div>
      <div className="photo"><img src={U("photo-1522202176988-66273c2fd55f")} alt="Students studying together at a table" />
        <div className="float"><div><span className="tag">Focus</span><div><b>25:00</b></div></div><div style={{ textAlign: "right" }}><span className="tag" style={{ background: "var(--coral)" }}>Break</span><div><b>5:00</b></div></div></div>
      </div>
    </div></section>

    <section className="s" id="features"><div className="wrap">
      <h2>Everything a good study session needs</h2><p className="sub">Small, calm features that protect your focus and your downtime.</p>
      <div className="grid4">{F.map(([i, t, d]) => <div className="card" key={t}><div className="ic" aria-hidden="true">{i}</div><h3>{t}</h3><p>{d}</p></div>)}</div>
    </div></section>

    <section className="s" id="why" style={{ background: "var(--mist)" }}><div className="wrap">
      <div className="split"><div className="photo"><img src={U("photo-1499750310107-5fef28a66643")} alt="Laptop and notebook on a tidy desk" /></div>
        <div><h2>Long sessions need real breaks</h2><p className="sub">Most students plan what to study but leave breaks to chance. Unplanned breaks drift into scrolling and you return more tired than before. Planning the rest first makes it part of the work.</p></div></div>
      <div className="split rev" style={{ marginTop: 72 }}><div className="photo"><img src={U("photo-1506126613408-eca07ce68773")} alt="Person stretching and relaxing" /></div>
        <div><h2>Rest that feels like rest</h2><p className="sub">Every break comes with a simple screen-free idea: stretch, drink water, look out of a window. Then a gentle reflection, with no scores and no pressure.</p></div></div>
    </div></section>

    <section className="s" id="how"><div className="wrap">
      <h2>Four steps, about one minute to start</h2>
      <div className="steps">{S.map(([t, d]) => <div className="step" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
    </div></section>

    <section className="s" style={{ paddingTop: 0 }}><div className="wrap">
      <div className="band"><img src={U("photo-1434030216411-0b793f4b4173")} alt="" />
        <div className="in"><h2>Ready for your first session?</h2><p className="sub">It takes a minute and needs no account.</p><div className="row" style={{ marginTop: 24 }}><Link className="btn mint" href="/app">Start a session</Link></div></div></div>
    </div></section>
  </>);
}
