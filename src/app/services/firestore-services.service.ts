import { Injectable } from '@angular/core';
import {catchError, Observable, of, tap} from "rxjs";
import {TeamData} from "../interfaces/teamData";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map, switchMap} from "rxjs/operators";
import Userdata from "../interfaces/userdata";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class FirestoreServicesService {

  constructor(private firestore: AngularFirestore,
              private afAuth: AngularFireAuth) {
  }
  getAllSpecies(): Observable<string[]> {
    const query = this.firestore.collectionGroup<TeamData>('TeamData');
    return query.valueChanges().pipe(
      tap(docs => console.log('TeamData documents:', docs)),
      map((docs: TeamData[]) => {
        const speciesNames: string[] = [];
        docs.forEach(doc => {
          for (let i = 1; i <= 6; i++) { // Assuming there are 6 sets
            const setKey = `set${i}`;
            const set = doc[setKey];
            if (set && set.species) {
              speciesNames.push(set.species);
            }
          }
        });
        return speciesNames;
      }),
      tap(species => console.log('Species:', species))
    );
  }

  getSpeciesFromDoc(docId: string): Observable<string[]> {
    const docRef = this.firestore.collection('TeamData').doc(docId);
    return docRef.valueChanges().pipe(
      map((doc: any) => {
        const speciesNames: string[] = [];
        if (doc && doc.set1) { // Check if 'set1' exists before accessing its properties
          for (let i = 1; i <= 6; i++) { // Assuming there are 6 sets
            const setKey = `set${i}`;
            const set = doc[setKey];
            if (set && set.species) {
              speciesNames.push(set.species);
            }
          }
        }
        return speciesNames;
      })
    );
  }

  getTeamFromDoc(docId: string): Observable<string | null> {
    const docRef = this.firestore.collection('TeamData').doc(docId);
    return docRef.valueChanges().pipe(
      map((doc: any) => doc ? doc.TEAM || null : null)  // Fetches actual team data/configuration
    );
  }

  getTeamNameFromDoc(docId: string): Observable<string | null> {
    const docRef = this.firestore.collection('TeamData').doc(docId);
    return docRef.valueChanges().pipe(
      map((doc: any) => doc ? doc.TeamName || null : null)  // Fetches the team's name
    );
  }

  getCommentsFromDoc(docId: string): Observable<string | null> {
    const docRef = this.firestore.collection('TeamData').doc(docId);
    return docRef.valueChanges().pipe(
      map((doc: any) => doc ? doc.Comments || null : null)  // Fetches the team's name
    );
  }

  getAllDocumentIds(collectionPath: string): Observable<string[]> {
    return this.firestore.collection(collectionPath).snapshotChanges().pipe(
      map(actions => actions.map(action => action.payload.doc.id))
    );
  }

  getCurrentUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map(user => user ? user.uid : null)
    );
  }

  // Method to fetch user data by user ID
  getUserData(userId: string): Observable<Userdata | null> {
    return this.firestore.collection<Userdata>('Userdata').doc(userId).valueChanges().pipe(
      map(data => data ? data : null)
    );
  }

  // Method to update user favorites
  updateUserFavorites(userId: string, favorites: string[]): Promise<void> {
    return this.firestore.collection('Userdata').doc(userId).set(
      {favorites}, {merge: true}
    );
  }
}
