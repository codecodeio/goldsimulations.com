#!/usr/bin/env python3
"""Set up Resend sending DNS for goldsimulations.com, with verification.

Runs the full four-step procedure:
  1. Snapshot the whole DNS zone to JSON (rollback reference)
  2. Create the ten Resend records on mail. and updates. — skipping any that
     already exist, so re-running is safe
  3. Re-read the zone and diff, proving every pre-existing record is untouched
  4. Trigger Resend verification for both domains

Only ever calls createDnsRecord. Never deletes or updates. Netlify's DNS API
has no update method, so existing records cannot be altered by this script.
"""
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ZONE = "696c467933d9a7705d949688"
DOMAIN = "goldsimulations.com"
OUT = Path(__file__).parent / "snapshots"
OUT.mkdir(exist_ok=True)

RESEND_PROFILE = "goldsimulations"
RESEND_DOMAINS = {
    "mail.goldsimulations.com": "16d17586-47ca-411e-aabb-7263638c7dc4",
    "updates.goldsimulations.com": "79208752-121e-4c92-86ab-b03a7566c8f9",
}

DKIM = {
    "mail": (
        "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDV/gy+qevhvx5nI4gyBlkAiJb1GUxqY8We"
        "wnsracV+0NyjRY35jtJz9NUMjV7ySVAH2W50QZ9OJERuvgny58rVfJfUJn704GcdZwFcA2YVTB"
        "OUvDtBDFLtnM000Va3PiVIpLmAzEZGsx45PiYjfAcCfdbcarbTgOt/wz0+h/5FlwIDAQAB"
    ),
    "updates": (
        "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXLLzpQiVxs+aJlSnHQsMNqbOFVnOxD8NX"
        "t0nbMhKD7eAebGMJAo1V6oKZfRiYuAVcNE4g4Q1IWSvv80j7FpswTIQYPuHiS/o2VAVKfRy1ZV"
        "qJlsSr1VbfvllFQKbJKFlbwDGL6lGg34NI2XDtccwPmjW53jKirsjALeyjnOqQYQIDAQAB"
    ),
}
SPF = "v=spf1 include:amazonses.com ~all"
RETURN_PATH = "feedback-smtp.us-east-1.amazonses.com"
RMTA = "send.forge.rmta.net"
DMARC = "v=DMARC1; p=none; rua=mailto:matt@goldsimulations.com"

DESIRED = []
for sub in ("mail", "updates"):
    DESIRED += [
        {"type": "TXT", "hostname": f"resend._domainkey.{sub}.{DOMAIN}", "value": DKIM[sub]},
        {"type": "MX", "hostname": f"send.{sub}.{DOMAIN}", "value": RETURN_PATH, "priority": 10},
        {"type": "TXT", "hostname": f"send.{sub}.{DOMAIN}", "value": SPF},
        {"type": "CNAME", "hostname": f"rsend.{sub}.{DOMAIN}", "value": RMTA},
        {"type": "TXT", "hostname": f"_dmarc.{sub}.{DOMAIN}", "value": DMARC},
    ]


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        detail = "\n".join(x.strip() for x in (p.stderr, p.stdout) if x.strip())
        raise RuntimeError(f"{' '.join(cmd[:3])} failed:\n{detail[:600]}")
    return p.stdout


def read_zone():
    return json.loads(run(["netlify", "api", "getDnsRecords",
                           "--data", json.dumps({"zone_id": ZONE})]))


def key(r):
    """Identity of a record for comparison — ignores server-assigned fields."""
    return (r["type"], r["hostname"].rstrip("."), r["value"].rstrip("."), r.get("priority"))


def section(n, title):
    print(f"\n{'─' * 66}\n{n}. {title}\n{'─' * 66}")


# ── 1. snapshot ──────────────────────────────────────────────────────────
section(1, "Snapshot current zone")
before = read_zone()
stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
snap = OUT / f"{DOMAIN}-{stamp}.json"
snap.write_text(json.dumps(before, indent=2))
print(f"  {len(before)} records → ops/dns/snapshots/{snap.name}")

before_keys = {key(r) for r in before}

# ── 2. create what's missing ─────────────────────────────────────────────
section(2, "Create Resend records")
missing = [r for r in DESIRED if key({**r, "priority": r.get("priority")}) not in before_keys]
if not missing:
    print("  all ten already present — nothing to do")
failures = []
for r in missing:
    # zone_id is a path parameter; the record itself must be nested under
    # `body`, which @netlify/api serialises to JSON. Sending it flat yields an
    # empty request body and a bare 422.
    payload = {"zone_id": ZONE, "body": {"ttl": 3600, **r}}
    label = f"{r['type']:5} {r['hostname']}"
    try:
        run(["netlify", "api", "createDnsRecord", "--data", json.dumps(payload)])
        print(f"  created  {label}")
    except RuntimeError as e:
        failures.append((label, str(e)))
        print(f"  FAILED   {label}")
skipped = len(DESIRED) - len(missing)
if skipped:
    print(f"  ({skipped} already existed, skipped)")

# ── 3. re-read and diff ──────────────────────────────────────────────────
section(3, "Verify nothing else changed")
after = read_zone()
after_keys = {key(r) for r in after}

lost = before_keys - after_keys
if lost:
    print("  !! PRE-EXISTING RECORDS MISSING — investigate immediately:")
    for t, h, v, p in sorted(lost):
        print(f"     {t:5} {h}  {v[:50]}")
else:
    print(f"  all {len(before_keys)} pre-existing records intact and unchanged")

added = after_keys - before_keys
print(f"  {len(added)} records added:")
for t, h, v, p in sorted(added):
    print(f"     {t:5} {h}")

# The records that must never move. `all()` over an empty list is vacuously
# true, so an empty result has to be treated as a failure explicitly —
# otherwise losing every apex MX record would print a reassuring all-clear.
critical = [r for r in after if r["type"] == "MX" and r["hostname"].rstrip(".") == DOMAIN]
if not critical:
    mx_state = "!! NONE FOUND — apex mail is broken"
elif all(key(r) in before_keys for r in critical):
    mx_state = "unchanged"
else:
    mx_state = "!! CHANGED"
print(f"  Google Workspace MX: {len(critical)} records present ({mx_state})")

# ── 4. trigger Resend verification ───────────────────────────────────────
section(4, "Resend domain verification")
if failures or lost:
    print("  skipped — resolve the problems above first")
else:
    for name, did in RESEND_DOMAINS.items():
        try:
            run(["resend", "domains", "verify", did, "--profile", RESEND_PROFILE])
            print(f"  triggered  {name}")
        except RuntimeError as e:
            print(f"  FAILED     {name}: {e}")
    print("\n  Verification is async. Check status with:")
    for name, did in RESEND_DOMAINS.items():
        print(f"    resend domains get {did} --profile {RESEND_PROFILE}   # {name}")

print()
if failures:
    print(f"{len(failures)} record(s) failed to create:")
    for label, err in failures:
        print(f"  {label}\n    {err}")
    sys.exit(1)
if lost:
    sys.exit(2)
print("Done.")
