import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Sets } from '@pkmn/sets';
import { Icons } from '@pkmn/img';
import { TeamData } from "../../interfaces/teamData";
import { FirestoreServicesService } from "../../services/firestore-services.service";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
declare var bootstrap: any;

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  formTEAM: FormGroup;
  userFavorites: string[] = [];
  userId: string | null = null;
  filteredTeams: any[] = [];
  teams: { [key: string]: any }[] = [];
  searchQuery: string = '';
  filterOption: string = 'favorites';
  editMode: boolean = false;
  editingTeamId: string | null = null;
  selectedTeam: string | null = null;
  selectedTeamData: string | null = null;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private firestoreServices: FirestoreServicesService,
    private sanitizer: DomSanitizer
  ) {
    this.formTEAM = this.fb.group({
      TeamName: ['', [Validators.required, Validators.maxLength(20)]],
      TEAM: ['', Validators.required],
      Comments: ['']
    });
  }

  ngOnInit(): void {
    this.updateFav();

    this.firestore
      .collection('TeamData')
      .snapshotChanges()
      .subscribe(actions => {
        this.teams = actions.map(action => {
          const data = action.payload.doc.data() as TeamData;
          const id = action.payload.doc.id;
          return { ...data, id };
        });

        this.teams.forEach(team => {
          if (team['uid'] === this.userId && !this.isFavorite(team['id'])) {
            this.userFavorites.push(team['id']);
          }
        });

        this.filterTeams();
      });
  }

  toggleFavorite(docId: string): void {
    if (!docId || !this.userId) {
      console.error('Invalid document ID or no user ID.');
      return;
    }

    const index = this.userFavorites.indexOf(docId);

    if (index === -1) {
      this.userFavorites.push(docId);
    } else {
      this.userFavorites.splice(index, 1);
    }

    this.firestoreServices
      .updateUserFavorites(this.userId, this.userFavorites)
      .then(() => {
        console.log('Favorites updated successfully.');
        this.filterTeams();
      })
      .catch(err => console.error('Error updating favorites:', err));
  }

  isFavorite(docId: string): boolean {
    return this.userFavorites.includes(docId);
  }

  filterTeams(): void {
    this.filteredTeams = this.teams
      .filter(team => {
        if (this.filterOption === 'favorites') {
          return this.isFavorite(team['id']) && team['TeamName'].toLowerCase().includes(this.searchQuery.toLowerCase());
        } else if (this.filterOption === 'created') {
          return team['uid'] === this.userId && team['TeamName'].toLowerCase().includes(this.searchQuery.toLowerCase());
        }
        return false;
      })
      .map(team => {
        const speciesIcons: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
          (team['TEAM'] || '')
            .split('\n\n')
            .map((pokemon: string) => {
              const set = Sets.importSet(pokemon);
              return `<span class="pokemon-icon" style="${Icons.getPokemon(<string>set.species).style}"></span>`;
            })
            .join('')
        );
        return { ...team, speciesIcons };
      });
  }

  deleteTeam(docId: string): void {
    if (confirm("¿Seguro que quieres borrar el equipo?")) {
      this.firestore.collection('TeamData').doc(docId).delete()
        .then(() => {
          console.log(`Team with ID ${docId} deleted successfully!`);
          this.teams = this.teams.filter(team => team['id'] !== docId);
          this.filterTeams();
        })
        .catch(error => console.error('Error deleting team:', error));
    }
    this.updateFav()
  }

  editTeam(team: any): void {
    this.editingTeamId = team['id'];
    this.editMode = true;
    this.formTEAM.setValue({
      TeamName: team['TeamName'],
      TEAM: team['TEAM'],
      Comments: team['Comments']
    });
  }

  onEnviar(): void {
    if (this.formTEAM.valid) {
      this.updateFav();
      this.auth.currentUser
        .then(user => {
          if (user) {
            const userUid = user.uid;
            const formData = this.formTEAM.value;
            formData['uid'] = userUid;
            const team = formData['TEAM'];
            const pokemonArray = team.split('\n\n');

            pokemonArray.forEach((pokemon: string, index: number) => {
              const set = Sets.importSet(pokemon);
              formData[`set${index + 1}`] = set;
            });

            if (this.editMode && this.editingTeamId) {
              this.firestore.collection<TeamData>('TeamData').doc(this.editingTeamId).update(formData)
                .then(() => {
                  console.log(`Team with ID ${this.editingTeamId} updated successfully!`);
                  location.reload()
                  this.updateFav()
                })
                .catch(error => console.error('Error updating team:', error));
            } else {
              this.firestore.collection<TeamData>('TeamData').add(formData)
                .then(() => {
                  console.log('Form data sent successfully!');
                  location.reload()
                  this.updateFav()
                })
                .catch(error => console.error('Error sending form data:', error));
            }
          } else {
            console.log('No user is currently logged in.');
          }
        })
        .catch(error => console.error('Error retrieving current user:', error));
    } else {
      console.log('Form is invalid. Please fill all required fields.');
    }
    this.updateFav()

  }

  showModal(teamName: string, teamData: string): void {
    this.selectedTeam = teamName;
    this.selectedTeamData = teamData;

    // Use Bootstrap's modal API to show the modal
  }

  closeModal(): void {
    this.selectedTeam = null;
    this.selectedTeamData = null;
  }
  resetEditForm(): void {
    this.formTEAM.reset();
    this.editMode = false;
    this.editingTeamId = null;
  }

  clipboard(): void {
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

  updateFav(){
    this.auth.currentUser
      .then(user => {
        this.userId = user ? user.uid : null;
        if (this.userId) {
          this.firestoreServices.getUserData(this.userId).subscribe(userdata => {
            this.userFavorites = userdata?.favorites || [];
            this.filterTeams();
          });
        }
      })
      .catch(error => console.error('Error retrieving current user:', error));
  }
}

