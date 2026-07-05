#!/usr/bin/env python3
"""CrewAI-style ops check without external services.

The output intentionally keeps the same report.json contract used by U3,
so Dashboard, LINE Flex payload generation, and GitHub Actions can share it.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INVENTORY = ROOT / "ops-agent-lab" / "inventory_sample.csv"
DEFAULT_OUTPUT = ROOT / "data-lab" / "report.json"

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


@dataclass(frozen=True)
class InventoryItem:
    sku: str
    product: str
    stock: int
    reorder_point: int
    unit_price: int
    owner: str
    channel: str

    @property
    def shortage(self) -> int:
        return max(self.reorder_point - self.stock, 0)

    @property
    def risk_exposure(self) -> int:
        return self.shortage * self.unit_price


def parse_int(row: dict[str, str], key: str) -> int:
    try:
        return int(row[key])
    except (KeyError, ValueError) as exc:
        sku = row.get("sku", "(unknown sku)")
        raise ValueError(f"invalid integer field {key!r} for {sku}") from exc


def load_inventory(path: Path) -> list[InventoryItem]:
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        required = {"sku", "product", "stock", "reorder_point", "unit_price", "owner", "channel"}
        missing = required.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"inventory CSV missing columns: {', '.join(sorted(missing))}")

        items = []
        for row in reader:
            items.append(
                InventoryItem(
                    sku=row["sku"],
                    product=row["product"],
                    stock=parse_int(row, "stock"),
                    reorder_point=parse_int(row, "reorder_point"),
                    unit_price=parse_int(row, "unit_price"),
                    owner=row["owner"],
                    channel=row["channel"],
                )
            )
    return items


def data_checker(items: list[InventoryItem]) -> dict[str, object]:
    low_stock = [item for item in items if item.stock <= item.reorder_point]
    out_of_stock = [item for item in items if item.stock <= 0]
    notes = []

    if not items:
        notes.append("inventory CSV has no rows")
    if any(item.stock < 0 for item in items):
        notes.append("negative stock found")
    if not notes:
        notes.append("inventory CSV readable; required columns present")

    return {
        "low_stock_items": low_stock,
        "out_of_stock_items": out_of_stock,
        "data_quality_notes": notes,
    }


def ops_decider(observations: dict[str, object]) -> dict[str, object]:
    low_stock = observations["low_stock_items"]
    out_of_stock = observations["out_of_stock_items"]

    if out_of_stock:
        risk_level = "high"
    elif low_stock:
        risk_level = "medium"
    else:
        risk_level = "low"

    top_item = max(low_stock, key=lambda item: (item.risk_exposure, item.shortage), default=None)
    channel_counts: dict[str, int] = {}
    for item in low_stock:
        channel_counts[item.channel] = channel_counts.get(item.channel, 0) + 1
    top_channel = max(channel_counts, key=channel_counts.get) if channel_counts else "Shop"

    return {
        "risk_level": risk_level,
        "anomaly_count": len(low_stock),
        "top_product": top_item.product if top_item else "無",
        "top_channel": top_channel,
        "risk_exposure": sum(item.risk_exposure for item in low_stock),
    }


def push_writer(observations: dict[str, object], decision: dict[str, object]) -> dict[str, object]:
    low_stock = sorted(
        observations["low_stock_items"],
        key=lambda item: (item.stock <= 0, item.risk_exposure, item.shortage),
        reverse=True,
    )

    if not low_stock:
        action_items = ["庫存都高於安全量，今天不用推播。"]
    else:
        action_items = [
            (
                f"補貨 {item.product}: 目前庫存 {item.stock}, 安全量 {item.reorder_point}, "
                f"請 {item.owner} 先確認採購與到貨日。"
            )
            for item in low_stock[:3]
        ]
        action_items.append("送出 LINE Flex 通知前，請主管人工確認補貨數量與收件對象。")

    return {
        "report_date": date.today().isoformat(),
        "risk_level": decision["risk_level"],
        "total_revenue": decision["risk_exposure"],
        "anomaly_count": decision["anomaly_count"],
        "top_product": decision["top_product"],
        "top_channel": decision["top_channel"],
        "action_items": action_items,
        "notification_theme": "low_stock_replenishment",
        "agent_trace": [
            {"role": "data_checker", "summary": observations["data_quality_notes"]},
            {
                "role": "ops_decider",
                "summary": f"risk_level={decision['risk_level']}; anomalies={decision['anomaly_count']}",
            },
            {"role": "push_writer", "summary": f"action_items={len(action_items)}"},
        ],
    }


def build_report(inventory_path: Path) -> dict[str, object]:
    items = load_inventory(inventory_path)
    observations = data_checker(items)
    decision = ops_decider(observations)
    return push_writer(observations, decision)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate U11 report.json from inventory signals.")
    parser.add_argument("--inventory", type=Path, default=DEFAULT_INVENTORY)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--write-report", action="store_true", help="write JSON to data-lab/report.json")
    args = parser.parse_args()

    report = build_report(args.inventory)
    text = json.dumps(report, ensure_ascii=False, indent=2)

    if args.write_report:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(f"{text}\n", encoding="utf-8")
        print(f"report written: {args.output.relative_to(ROOT)}")
    else:
        print(text)


if __name__ == "__main__":
    main()
