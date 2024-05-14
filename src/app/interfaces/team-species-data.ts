import {SafeHtml} from "@angular/platform-browser";

export interface TeamSpeciesData {
  docId: string;
  speciesIcons: SafeHtml;
  teamName: string | null;
  teamData: string | null;
  comments: string | null;
}
