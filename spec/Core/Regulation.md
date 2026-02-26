# Regulation

> Hard constraints for this research project's spec maintenance.

## File Constraints

- All spec files ≤ 150 lines (AI attention page size)
- File too long → becomes a folder with Meta.md
- Every folder must have Meta.md with Context Injection Guide

## Literature Discipline

- Every paper in Reading-Queue must have: title, keywords, status, one-line note
- Status transitions: 待读 → 在读 → 已读
- When a paper reaches "已读", must have one-sentence core takeaway
- Important papers (≥ 3 references in Concepts/) get their own folder

## Concepts Discipline

- New ideas go to Ideas-Log.md first (time-ordered, append-only at top)
- Ideas with status ≥ 📐 (designing) should have a concept folder
- Concept folders require at minimum: Motivation.md + Design.md + Open-Questions.md
- Link back to triggering literature with relative paths

## Prototype Discipline

- Every prototype must have README.md (hypothesis + how to run)
- No implicit dependencies between prototypes
- Archived prototypes get `ARCHIVED-` prefix, moved to `_archived/`

## Session Discipline

- End of each session: append entry to Progress/ with 4 dimensions
  (Reading / Ideas / Prototypes / Direction changes)
- Update Todo.md with any deferred items
