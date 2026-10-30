# Content expansion plan

## Targets

- **80 distinct playable faction cards** (including fully specified progression, requirements, and battlefield identity).
- **30 campaign sectors** with varied maps, encounter patterns, objectives and difficulty.
- Preserve the four-faction identity established in the project; expand faction count only with a clear design justification.

**Baseline:** the live project was reported on 29 October 2026 as containing **32 playable cards plus Core Hull**, four factions and **18 campaign sectors**. Re-count the *actual source catalog* before every expansion run. Do not assume this snapshot is still accurate.

## Principles

### Cards
Each card must have:
- a unique identifier, name, faction, role, rarity/cost where applicable;
- an interpretable upgrade path with actual numerical or behavioral effects;
- a distinct strategic niche and at least one counter or trade-off;
- artwork/icon references with compatible licenses;
- catalog and shop/unlock compatibility; and
- test coverage or a documented manual checklist.

Favor new decisions: anti-armor, area denial, timing windows, targeted support, mobility, reinforcements, and situational control. Avoid cards differing only in raw damage.

### Sectors
Each sector must have:
- a unique ID/name and visible unlock requirements;
- an identifiable battlefield layout and clear reactor defenses;
- a deliberately paced enemy roster and wave cadence;
- difficulty and rewards appropriate to its position;
- at least one novel decision, environmental constraint, or encounter motif;
- smoke/validation coverage and repeatable success criteria.

### Interface and readability
- Do not display repetitive tutorial paragraphs on every battle screen.
- Make wave countdown and start unmistakable; assess early wave call as an optional strategic decision with energy reward.
- Make faction bonuses legible and compact (use structured rows where useful).
- Provide clear armored enemy affordances without relying on color alone.
- Place detailed rules and encountered enemy descriptions in the Field Manual.

## Incremental sequence

1. **Inventory and tests:** inspect catalogs, saves, balance tools and current sector/wave definitions; document actual counts.
2. **Improve core usability:** wave indicators, battle UI simplification, faction bonus legibility and enemy armor visibility.
3. **Add balanced card batches:** introduce a few cards at a time, verify unique roles and upgrade scaling.
4. **Extend campaign by themed groups:** introduce maps/mechanics incrementally, with boss/mini-boss cadence and rewards checked.
5. **Balance sweep:** review early/mid/late-game resource economies, enemy time-to-kill, damage to Core Hull and accessibility.
6. **Release hygiene:** update changelog, test migrations and deploy only from reviewed builds.

## Quality gates per batch

- Catalog counts checked without duplicate IDs.
- No unresolved required asset licenses.
- Existing saves still work or have an explicit migration.
- No broken sector unlocks, shop eligibility, faction thresholds or wave spawns.
- No significant FPS/performance regression on a representative battle.
- Tests/build green, or exact blockers documented.
