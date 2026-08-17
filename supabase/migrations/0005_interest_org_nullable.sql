-- On the project-interest / waiting-list form, "Betrieb / Organisation" is
-- optional (a farm's name may equal the person's name). The report forms keep
-- organization required. Relax the NOT NULL constraint so an interest
-- submission without an organisation is stored instead of rejected.
alter table project_interests alter column organization drop not null;
