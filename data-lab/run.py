#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
data-lab / run.py

讀 data/sales.csv,做最簡單的資料檢查,印出固定四欄:
    insight / anomalies / risk_level / action_items

資料合約規定 risk_level 只能是 low / medium / high。
"""
import csv
import json
import os
import sys

# 讓中文在任何終端機都能正常顯示(不會變亂碼)。你今天不用管這行。
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, "data", "sales.csv")


def load_rows(path):
    """把 csv 讀成一列一列的資料。"""
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def to_number(value):
    """把字串轉成數字;空字串或轉不動就回 None。"""
    if value is None or value.strip() == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def check(rows):
    anomalies = []
    total_revenue = 0.0
    counted = 0

    for i, row in enumerate(rows, start=1):
        qty = to_number(row.get("qty"))
        revenue = to_number(row.get("revenue"))

        # 1) 缺漏:有欄位是空的
        if qty is None or revenue is None:
            anomalies.append(f"第 {i} 列有缺漏(qty 或 revenue 是空的)")
            continue
        # 2) 負數:數量或營收小於 0
        if qty < 0 or revenue < 0:
            anomalies.append(
                f"第 {i} 列出現負數(qty={row.get('qty')}, revenue={row.get('revenue')})"
            )
            continue
        # 3) 過大:數量大到不合理,可能打錯
        if qty > 1000:
            anomalies.append(f"第 {i} 列數量過大,可能打錯(qty={row.get('qty')})")
            continue

        total_revenue += revenue
        counted += 1

    insight = f"乾淨的資料有 {counted} 列,合計營收約 {int(total_revenue)} 元。"

    # risk_level:異常越多,風險越高
    n = len(anomalies)
    if n == 0:
        level = "low"
    elif n <= 2:
        level = "medium"
    else:
        level = "high"

    risk_level = level

    action_items = []
    if anomalies:
        action_items.append("先確認上面列出的可疑資料是不是打錯了")
    if counted == 0:
        action_items.append("目前沒有可用資料,先別下結論")
    if not action_items:
        action_items.append("資料看起來正常,可以照常出報表")

    return {
        "insight": insight,
        "anomalies": anomalies,
        "risk_level": risk_level,
        "action_items": action_items,
    }


def main():
    rows = load_rows(CSV_PATH)
    report = check(rows)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
