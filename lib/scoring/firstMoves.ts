import type { OpportunityItem } from "../types/report";

export function getFirstMoves(items: OpportunityItem[]): OpportunityItem[] {
  const scored = items.map((item) => ({
    ...item,
    _sort: item.effort > 0 ? (item.impact + item.roi) / item.effort : 0,
  }));

  scored.sort((a, b) => b._sort - a._sort);

  return scored.slice(0, 3).map(({ _sort, ...item }) => ({
    ...item,
    isFirstMove: true,
  }));
}

export function formatFirstMovesList(firstMoves: OpportunityItem[]): string {
  if (firstMoves.length === 0) return "";
  return firstMoves.map((fm) => fm.initiative).join("; ");
}
