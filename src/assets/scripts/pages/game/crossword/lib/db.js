import Dexie from 'dexie';

export const i_db = new Dexie('CreaftarDB');

i_db.version(1).stores({
  rascunhosEditor: 'chave'//,
  //progressoJogo: 'id, usuarioId, gameId'
});