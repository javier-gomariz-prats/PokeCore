import {SafeHtml} from "@angular/platform-browser";
//para sacar los doc ID y datos
export interface TeamSpeciesData {
  docId: string;
  speciesIcons: SafeHtml;
  teamName: string | null;
  teamData: string | null;
  comments: string | null;
}
