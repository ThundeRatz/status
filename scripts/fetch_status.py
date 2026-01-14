#!/usr/bin/env python3
"""
Fetch status from UptimeRobot API and process into a clean JSON for the frontend.
"""

import json
import os
import urllib.request
import urllib.parse
from datetime import datetime, timezone

API_URL = "https://api.uptimerobot.com/v2/getMonitors"
DAYS = 60

# Generate the ratio string: 1-2-3-4-...-60
UPTIME_RATIOS = "-".join(str(i) for i in range(1, DAYS + 1))

STATUS_MAP = {
    0: "paused",
    1: "pending",
    2: "up",
    8: "seems_down",
    9: "down",
}


def fetch_monitors(api_key: str) -> dict:
    """Fetch monitors from UptimeRobot API."""
    data = urllib.parse.urlencode({
        "api_key": api_key,
        "format": "json",
        "logs": "1",
        "custom_uptime_ratios": UPTIME_RATIOS,
    }).encode()

    req = urllib.request.Request(API_URL, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def get_real_days(create_timestamp: int) -> int:
    """
    Calculate how many days of real data the monitor has.

    Args:
        create_timestamp: Unix timestamp when monitor was created

    Returns:
        Number of days with real data (minimum 1)
    """
    created = datetime.fromtimestamp(create_timestamp, tz=timezone.utc)
    now = datetime.now(timezone.utc)
    delta = now - created
    # Add 1 because day 0 counts as day 1
    return max(1, delta.days + 1)


def parse_uptime_ratios(ratio_str: str, real_days: int) -> list[float | None]:
    """
    Convert cumulative uptime ratios to daily uptime percentages.

    Input: "100.000-99.500-99.000-..." (cumulative: 1 day, 2 days, 3 days...)
    Output: [100.0, 99.0, 98.0, ...] (individual days, newest first)

    Days without real data are marked as None.

    Args:
        ratio_str: Hyphen-separated cumulative uptime ratios
        real_days: Number of days with actual monitoring data

    Returns:
        List of daily uptime percentages (None for days without data)
    """
    if not ratio_str:
        return [None] * DAYS

    cumulative = [float(x) for x in ratio_str.split("-")]
    daily: list[float | None] = []

    for i, ratio in enumerate(cumulative):
        day_number = i + 1  # 1-indexed day

        # If this day is beyond real data, mark as None
        if day_number > real_days:
            daily.append(None)
            continue

        if i == 0:
            daily.append(ratio)
        else:
            # day_i_uptime = (cumulative[i] * (i+1)) - (cumulative[i-1] * i)
            prev_total = cumulative[i - 1] * i
            curr_total = ratio * (i + 1)
            day_uptime = curr_total - prev_total
            # Clamp between 0 and 100
            daily.append(max(0.0, min(100.0, day_uptime)))

    return daily


def parse_logs(logs: list[dict]) -> list[dict]:
    """Parse incident logs into a clean format."""
    incidents = []

    for log in logs:
        log_type = log.get("type")
        if log_type not in (1, 2):  # 1 = down, 2 = up
            continue

        dt = datetime.fromtimestamp(log["datetime"], tz=timezone.utc)
        duration = log.get("duration", 0)
        reason = log.get("reason", {})

        incidents.append({
            "type": "down" if log_type == 1 else "up",
            "datetime": dt.isoformat(),
            "duration_seconds": duration,
            "reason": reason.get("detail") if reason else None,
        })

    return incidents


def process_monitors(raw: dict) -> dict:
    """Process raw API response into clean frontend format."""
    services = []

    for monitor in raw.get("monitors", []):
        # Calculate real days of data
        create_timestamp = monitor.get("create_datetime", 0)
        real_days = get_real_days(create_timestamp)

        # Parse uptime ratios considering real data availability
        ratio_str = monitor.get("custom_uptime_ratio", "")
        daily_history = parse_uptime_ratios(ratio_str, real_days)

        # Calculate 30-day uptime from cumulative (index 29 = 30 days)
        # Only if we have at least 30 days of real data
        cumulative = [float(x) for x in ratio_str.split("-")] if ratio_str else []
        if len(cumulative) >= 30 and real_days >= 30:
            uptime_30d = cumulative[29]
        elif len(cumulative) > 0 and real_days > 0:
            # Use available data: uptime for real_days period
            idx = min(real_days - 1, len(cumulative) - 1)
            uptime_30d = cumulative[idx]
        else:
            uptime_30d = None

        services.append({
            "name": monitor["friendly_name"],
            "url": monitor["url"],
            "status": STATUS_MAP.get(monitor["status"], "unknown"),
            "uptime_30d": round(uptime_30d, 2) if uptime_30d is not None else None,
            "real_days": real_days,
            "daily_history": [
                round(d, 2) if d is not None else None
                for d in daily_history
            ],
            "incidents": parse_logs(monitor.get("logs", [])),
        })

    return {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "services": services,
    }


def load_existing_status(path: str) -> dict | None:
    """Load existing status.json to preserve data on fetch failure."""
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def main():
    output_path = os.environ.get("STATUS_OUTPUT", os.path.join(os.path.dirname(__file__), "..", "data", "status.json"))

    api_key = os.environ.get("UPTIMEROBOT_API_KEY")
    if not api_key:
        raise RuntimeError("UPTIMEROBOT_API_KEY environment variable not set")

    try:
        raw = fetch_monitors(api_key)

        if raw.get("stat") != "ok":
            raise RuntimeError(f"API error: {raw}")

        processed = process_monitors(raw)
        processed["fetch_error"] = None

    except Exception as e:
        print(f"Fetch failed: {e}")
        existing = load_existing_status(output_path)

        if existing:
            processed = existing
            processed["fetch_error"] = {
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            processed["updated_at"] = existing.get("updated_at", "")
        else:
            processed = {
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "services": [],
                "fetch_error": {
                    "message": str(e),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            }

    with open(output_path, "w") as f:
        json.dump(processed, f, indent=2)

    if processed.get("fetch_error"):
        print(f"Saved with fetch error: {processed['fetch_error']['message']}")
    else:
        print(f"Updated {output_path} with {len(processed['services'])} services")
        for service in processed['services']:
            print(f"  - {service['name']}: {service['status']} ({service['real_days']} days of data)")


if __name__ == "__main__":
    main()
