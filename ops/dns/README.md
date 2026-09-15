# DNS operations

DNS for `goldsimulations.com` is hosted on **Netlify DNS** (zone SOA is
`domains+netlify.netlify.com`, nameservers `dns[1-4].p03.nsone.net`). The zone
is shared: it carries Google Workspace mail, the legacy IIS site, and the Resend
sending subdomains. Changes here can break business email, so everything in this
directory is written to be conservative and reversible.

## What's here

| Path | Purpose |
| --- | --- |
| `setup-dns.py` | Creates the Resend sending records and proves nothing else moved |
| `snapshots/` | Full zone dumps, timestamped UTC, one per run |

## Sending domains

Mail is split by reputation profile, so a newsletter that collects spam
complaints cannot degrade delivery of account email:

| Subdomain | Carries | From address |
| --- | --- | --- |
| `mail.goldsimulations.com` | Transactional — subscribe confirmations now; password resets, receipts and class invites later | `hello@mail.goldsimulations.com` |
| `updates.goldsimulations.com` | Marketing — the newsletter | `news@updates.goldsimulations.com` |

Each needs five records: a DKIM `TXT`, an SPF `MX` and `TXT` on `send.<sub>`, a
`CNAME` on `rsend.<sub>`, and a DMARC `TXT` on `_dmarc.<sub>`.

## Running it

```bash
resend whoami --profile goldsimulations   # must be the goldsimulations team
netlify status                            # must be authenticated
python3 ops/dns/setup-dns.py
```

The script is idempotent — it compares against the live zone and creates only
what is missing, so re-running after a partial failure is safe.

It performs four steps in order:

1. **Snapshot** the entire zone to `snapshots/<domain>-<UTC>.json`
2. **Create** only the missing Resend records on `mail.` and `updates.`
3. **Diff** the zone against the snapshot, asserting every pre-existing record
   is still present and byte-identical, and reporting the Workspace `MX` count
   explicitly
4. **Verify** both domains in Resend — skipped entirely if step 2 or 3 reported
   a problem, so verification never runs against a damaged zone

Resend verification is asynchronous. The script prints the `resend domains get`
commands to poll afterwards.

## Safety properties

- The only write it can make is `createDnsRecord`. It never calls
  `deleteDnsRecord`, and the Netlify DNS API has no update method at all, so
  existing records cannot be altered by this script.
- Every hostname is built as `…{sub}.goldsimulations.com` from a fixed pair of
  subdomains, so it cannot emit a record outside those two subtrees.
- The apex `A` records are deliberately out of scope. Moving the site off the
  legacy IIS server at `131.153.102.6` is a separate, manual cutover.

## Rolling back

Snapshots are the rollback reference. Netlify has no update method, so restoring
a record means deleting the current one and recreating it from the snapshot:

```bash
netlify api getDnsRecords --data '{"zone_id":"696c467933d9a7705d949688"}'
netlify api deleteDnsRecord --data '{"zone_id":"...","dns_record_id":"..."}'
netlify api createDnsRecord --data '{"zone_id":"...", ...}'
```

## Known gap

The apex has Google Workspace `MX` records but **no SPF and no DMARC**, so mail
from `@goldsimulations.com` is unauthenticated. That hurts deliverability today
and is independent of the newsletter. Fix it as its own change, verifying normal
mail still flows — do not bundle it with this work.
