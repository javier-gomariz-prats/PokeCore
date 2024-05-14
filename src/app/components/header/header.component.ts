import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { FirestoreServicesService } from "../../services/firestore-services.service";
import { take } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('muteButton') muteButton!: ElementRef<HTMLButtonElement>;
  firestoreService: FirestoreServicesService;
  isMuted = false;

  constructor(
    public authService: AuthService,
    firestoreService: FirestoreServicesService
  ) {
    this.firestoreService = firestoreService;
  }

  ngOnInit() {
  }
  playMusic(musicFile: string): void {
    this.audioPlayer.nativeElement.src = musicFile;
    this.audioPlayer.nativeElement.play();
    this.isMuted = false;
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted; // Se cambia el mute
    this.audioPlayer.nativeElement.muted = this.isMuted;

    console.log('New mute state after toggle:', this.isMuted);
  }

}
