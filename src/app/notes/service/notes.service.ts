import { Injectable, computed, inject, signal } from '@angular/core';
import { SupabaseService } from '../../shared/supabase.service';
import { state } from '@angular/animations';
import { AuthService } from '../../auth/service/auth.service';

export interface Note {
  id: string;
  title: string;
  status: boolean | null;
  user_id?: string;
}
interface NoteState {
  notes: Note[];
  loading: boolean;
  error: boolean;
}
@Injectable({ providedIn: 'root' })
export class NotesService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private _authService = inject(AuthService);

  private _state = signal<NoteState>({
    notes: [],
    loading: false,
    error: false,
  });

  notes = computed(() => this._state().notes);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  async getAllNotes() {
    try {
      this._state.update((state) => ({
        ...state,
        loading: true,
      }));
      const {
        data: { session },
      } = await this._authService.session();
      const { data } = await this._supabaseClient
        .from('notes')
        .select()
        .eq('user_id', session?.user.id)
        .returns<Note[]>();
      if (data && data.length > 0) {
        this._state.update((state) => ({
          ...state,
          notes: data,
        }));
      }
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    } finally {
      this._state.update((state) => ({
        ...state,
        loading: false,
      }));
    }
  }

  async insertNote(note: { title: string; status: boolean | string }) {
    try {
      const {
        data: { session },
      } = await this._authService.session();
      const response = await this._supabaseClient.from('notes').insert({
        user_id: session?.user.id,
        status: note.status,
        title: note.title,
      });
      console.log(response);
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    }
  }

  async updateNote(note: { title: string; status: boolean; id: string }) {
    try {
      await this._supabaseClient
        .from('notes')
        .update<Note>({
          ...note,
        })
        .eq('id', note.id);
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    }
  }

  async updateNoteStatus(note: {status: boolean; id: string }) {
    try {
      await this._supabaseClient
        .from('notes')
        .update({
          ...note,
        })
        .eq('id', note.id);
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    }
  }

  

  async deleteNote(id: string) {
    try {
      await this._supabaseClient.from('notes').delete().eq('id', id);
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    }
  }
}
