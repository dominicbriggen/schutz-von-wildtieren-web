-- Real historical content (e.g. the ETF Lausanne 2025 sponsoring post)
-- only has an imprecise, non-ISO date on the old site ("2025"). Rather
-- than invent an exact timestamp, allow an optional free-text label.
alter table news add column date_label text;
alter table projects add column date_label text;
