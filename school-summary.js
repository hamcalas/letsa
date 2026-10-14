(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SchoolSummary = factory();
})(typeof self !== "undefined" ? self : this, function () {
  // باید با norm در record.py یکسان باشد
  const norm = (s) =>
    String(s || "").toLowerCase()
      .replace(/[\u064B-\u065F\u0640]/g, "")
      .replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[ۀة]/g, "ه")
      .replace(/[أإ]/g, "ا").replace(/ؤ/g, "و")
      .replace(/[\u200c\u200e\u200f]/g, " ")
      .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 0x06f0)
      .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x0660)
      .replace(/\s+/g, " ").trim();

  class SchoolSummary {
    constructor(base) {
      this.base = base.replace(/\/+$/, "") + "/api/v1";
      this._c = {};
    }
    _get(path) {
      if (!this._c[path]) {
        this._c[path] = fetch(`${this.base}/${path}`)
          .then((r) => {
            if (!r.ok) throw new Error(`${r.status} ${path}`);
            return r.json();
          })
          .catch((e) => { delete this._c[path]; throw e; });
      }
      return this._c[path];
    }
    meta() { return this._get("meta.json"); }
    latest() { return this._get("latest.json"); }
    day(date) { return this._get(`days/${date}.json`); }
    async index() { return (await this._get("index.json")).days; }
    async month(ym) { return (await this._get(`months/${ym}.json`)).days; }

    // بازه‌ی تاریخ و فیلتر موضوع: range("2026-10-01", "2026-10-31", {topic:"امتحان", limit:10})
    async range(from, to, { topic, limit } = {}) {
      let d = await this.index();
      if (from) d = d.filter((x) => x.date >= from);
      if (to) d = d.filter((x) => x.date <= to);
      if (topic) {
        const t = norm(topic);
        d = d.filter((x) => (x.topics || []).some((h) => norm(h).includes(t)));
      }
      return limit ? d.slice(0, limit) : d;
    }

    // جستجو: همه‌ی کلمات باید وجود داشته باشند؛ نتایج بر اساس تعداد تکرار مرتب می‌شوند
    async search(q, { from, to, limit = 20 } = {}) {
      const toks = norm(q).split(" ").filter(Boolean);
      if (!toks.length) return [];
      const meta = await this.meta();
      const years = meta.years.filter(
        (y) => (!from || y >= from.slice(0, 4)) && (!to || y <= to.slice(0, 4))
      );
      const shards = await Promise.all(years.map((y) => this._get(`search/${y}.json`)));
      const idx = new Map((await this.index()).map((d) => [d.date, d]));
      const out = [];
      for (const s of shards.flat()) {
        if ((from && s.d < from) || (to && s.d > to)) continue;
        if (!toks.every((t) => s.n.includes(t))) continue;
        let score = 0;
        for (const t of toks) score += s.n.split(t).length - 1;
        out.push({ ...idx.get(s.d), score });
      }
      out.sort((a, b) => b.score - a.score || (a.date < b.date ? 1 : -1));
      return out.slice(0, limit);
    }
  }
  SchoolSummary.norm = norm;
  return SchoolSummary;
});
