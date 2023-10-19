import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  // Obtener comentarios
  getComments(): Observable<any>{
    return this.http.get('https://tallertriumviratusapp-default-rtdb.firebaseio.com/.json');
  }

  // Agregar comentario
  addComment(comment) {
    return this.http.put('https://tallertriumviratusapp-default-rtdb.firebaseio.com/comentarios.json', comment);
  }

  // Eliminar comentario

  deleteComment(id) {
    return this.http.delete(`https://tallertriumviratusapp-default-rtdb.firebaseio.com/comentarios/${id}.json`);
  }

  // Actualizar comentario
  updateComment(id, comment) {
    return this.http.patch(`https://tallertriumviratusapp-default-rtdb.firebaseio.com/comentarios/${id}.json`, comment);
  }
}
