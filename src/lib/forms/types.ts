// Database row shapes for the /mitmachen submissions, used by the admin views.

export type SubmissionStatus = "neu" | "gesichtet" | "erledigt" | "archiviert";
export type InterestStatusValue =
  | "neu"
  | "kontaktiert"
  | "warteliste"
  | "zugesagt"
  | "abgeschlossen"
  | "abgelehnt";
export type FenceReportGroup = "project" | "comparison";
export type EntanglementOutcome = "unverletzt" | "verletzt" | "verendet";

export type AnimalEntry = { species: string; count: number };
export type EntanglementEvent = {
  species: string;
  count: number;
  outcome: EntanglementOutcome;
};
export type ImageRef = {
  path: string;
  name?: string;
  size?: number;
  type?: string;
};

export type WildseekReport = {
  id: string;
  organization: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  canton: string;
  municipality: string;
  system_number: string | null;
  report_from: string | null;
  report_to: string | null;
  deployment_count: number | null;
  mounting_type: string | null;
  mounting_type_other: string | null;
  no_rescue: boolean;
  rescued_animals: AnimalEntry[];
  notes: string | null;
  images: ImageRef[];
  image_publish_consent: boolean;
  status: SubmissionStatus;
  admin_note: string | null;
  created_at: string;
};

export type FenceReport = {
  id: string;
  report_group: FenceReportGroup;
  organization: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  canton: string;
  municipality: string;
  fence_height_cm: number | null;
  fence_length_m: number | null;
  livestock_types: string | null;
  livestock_count: number | null;
  installation_date: string | null;
  system_label: string | null;
  fence_type: string | null;
  fence_type_other: string | null;
  fence_color: string | null;
  fence_color_other: string | null;
  fence_age: string | null;
  observation_from: string | null;
  observation_to: string | null;
  operating_days: number | null;
  entanglement_occurred: boolean;
  entanglement_event_count: number | null;
  entanglement_events: EntanglementEvent[];
  wolf_attack_occurred: boolean;
  wolf_attack_event_count: number | null;
  wolf_injured_livestock: number | null;
  wolf_killed_livestock: number | null;
  wolf_note: string | null;
  maintenance: string | null;
  maintenance_note: string | null;
  images: ImageRef[];
  image_publish_consent: boolean;
  status: SubmissionStatus;
  admin_note: string | null;
  created_at: string;
};

export type ProjectInterest = {
  id: string;
  project_interest: "wildseek" | "weidezaun" | "beide";
  organization: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  canton: string;
  wildseek_need: string | null;
  wildseek_area: string | null;
  fence_length_m: number | null;
  livestock_types: string | null;
  fence_situation: string | null;
  notes: string | null;
  status: InterestStatusValue;
  admin_note: string | null;
  created_at: string;
};
