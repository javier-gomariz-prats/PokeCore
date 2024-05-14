import { Injectable } from '@angular/core';
import firebase from "firebase/compat";
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore} from "@angular/fire/firestore";
import Userdata from "../interfaces/userdata";

@Injectable({
  providedIn: 'root'
})
export class UserdataServicesService {

  constructor(private firestore: Firestore) { }

  addUserData(userdata:Userdata){
    const userdataRef =collection(this.firestore, 'Userdata');
    return addDoc(userdataRef, userdata);
  }



}
