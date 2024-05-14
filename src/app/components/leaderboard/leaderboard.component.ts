import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { FirestoreServicesService } from '../../services/firestore-services.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TeamSpeciesData } from '../../interfaces/team-species-data';
import { Icons } from '@pkmn/img';
declare var bootstrap: any;
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  speciesAndTeams$: Observable<TeamSpeciesData[]> | undefined;
  selectedTeam: string | null = null;
  selectedTeamData: string | null = null;
  userFavorites: string[] = [];
  userId: string | null = null;

  constructor(

    private firestoreServices: FirestoreServicesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.speciesAndTeams$ = this.firestoreServices.getAllDocumentIds('TeamData').pipe(
      switchMap(documentIds => combineLatest(documentIds.map(docId =>
        combineLatest([
          this.firestoreServices.getSpeciesFromDoc(docId),
          this.firestoreServices.getTeamFromDoc(docId),
          this.firestoreServices.getTeamNameFromDoc(docId),
          this.firestoreServices.getCommentsFromDoc(docId) // Include comments fetching
        ]).pipe(
          map(([speciesArray, teamData, teamName, comments]) => ({
            docId, // Include the document ID
            speciesIcons: this.sanitizer.bypassSecurityTrustHtml(
              speciesArray.map(speciesName =>
                `<span class="species-icon" style="${Icons.getPokemon(speciesName).style}"></span>`
              ).join('')
            ),
            teamName,
            teamData,
            comments
          }))
        ))
      ))
    );

    // Fetch current user ID and their favorites
    this.firestoreServices.getCurrentUserId().pipe(
      tap(userId => {
        this.userId = userId;
        if (userId) {
          this.firestoreServices.getUserData(userId).subscribe(userdata => {
            this.userFavorites = userdata?.favorites || [];
          });
        }
      })
    ).subscribe();
  }

  showModal(teamName: string | null, teamData: string | null): void {
    this.selectedTeam = teamName;
    this.selectedTeamData = teamData;
  }

  closeModal(): void {
    this.selectedTeam = null;
    this.selectedTeamData = null;
  }
  copyToClipboard(): void {
    if (this.selectedTeam && this.selectedTeamData) {
      const formattedData = `${this.selectedTeamData}`;
      navigator.clipboard.writeText(formattedData).then(() => {
        const toastEl = document.getElementById('clipboard-toast');
        if (toastEl) {
          const toast = new bootstrap.Toast(toastEl);
          toast.show();
          setTimeout(() => {
            toast.hide();  // Hide the toast
          }, 3000);
        }
      }, err => {
        console.error('Could not copy text: ', err);
      });
    }
  }

  toggleFavorite(docId: string): void {
    if (!docId || !this.userId) {
      console.error('Invalid document ID or no user ID.');
      return;
    }

    const index = this.userFavorites.indexOf(docId);

    if (index === -1) {
      this.userFavorites.push(docId); // Add to favorites
    } else {
      this.userFavorites.splice(index, 1); // Remove from favorites
    }
    // Update favorites in Firestore
    this.firestoreServices.updateUserFavorites(this.userId, this.userFavorites)
      .then(() => console.log('Favorites updated successfully.'))
      .catch(err => console.error('Error updating favorites:', err));
  }

  isFavorite(docId: string): boolean {
    // Check if docId is in userFavorites
    return this.userFavorites.includes(docId);
  }


}
