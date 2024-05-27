import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { Note, NotesService } from '../../service/notes.service';
import {
  FormBuilder,
  FormControl,
  MinLengthValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

interface NoteForm {
  title: FormControl<string | null>;
  status: FormControl<boolean | null>;
}
@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-list.component.html',
  styles: ``,
})
export class NoteListComponent implements AfterViewInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  notesService = inject(NotesService);
  noteSeleted: Note | null = null;
  noteList: Note[] = [];
  showAll = signal(false);

  form = this._formBuilder.group<NoteForm>({
    title: this._formBuilder.control(null, Validators.required),
    status: this._formBuilder.control(false),
  });

  async ngAfterViewInit() {
    await this.loadData();
  }
  async loadData() {
    await this.notesService.getAllNotes();
    this.noteList = this.notesService.notes();
  }

  onCheckboxChange(event: any) {
    const target = event.target as HTMLInputElement; // Conversão de tipo explícita
    this.showAll.set(target.checked);
  }

  getFilteredNotes() {
    if (this.showAll()) {
      return this.noteList;
    } else {
      return this.noteList.filter((note) => note.status === false);
    }
  }
  async logout() {
    await this._authService.logout();
    this._router.navigateByUrl('/login');
  }
  async addNewNote() {
    if (this.noteSeleted) {
      await this.notesService.updateNote({
        title: this.form.value.title ?? '',
        status: this.form.value.status ?? false,
        id: this.noteSeleted.id,
      });
    } else {
      await this.notesService.insertNote({
        title: this.form.value.title ?? '',
        status: this.form.value.status ?? false,
      });
    }
    this.form.reset();
    this.noteSeleted = null;
    await this.loadData();
  }
  editNote(note: Note) {
    this.noteSeleted = note;

    this.form.setValue({
      title: this.noteSeleted.title,
      status: this.noteSeleted.status,
    });
  }
  async setStatus(note: Note) {
    await this.notesService.updateNoteStatus({
      status: true,
      id: note.id,
    });
    await this.loadData();
  }

  async deletarNote(note: Note) {
    await this.notesService.deleteNote(note.id);
    await this.loadData();
  }
}
