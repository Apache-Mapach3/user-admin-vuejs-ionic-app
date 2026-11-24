<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSelect, IonSelectOption, IonRefresher, IonRefresherContent, IonAlert, onIonViewWillEnter } from '@ionic/vue';
import { useApplication, errorMessage, roleLabel, statusLabel } from '../context';
import type { UserResponse } from '../../../application/dto/responses/user-responses';
const app = useApplication(); const route = useRoute();
const users = ref<UserResponse[]>([]); const search = ref(''); const status = ref(''); const busy = ref(false); const deleting = ref(false); const error = ref(''); const success = ref(''); const selected = ref<UserResponse | null>(null);
const admin = computed(() => app.currentSession()?.role === 'ADMIN'); const canRead = computed(() => ['ADMIN','REVIEWER'].includes(app.currentSession()?.role || ''));
const filtered = computed(() => users.value.filter(u => `${u.name} ${u.email} ${u.id}`.toLowerCase().includes(search.value.trim().toLowerCase()) && (!status.value || status.value === u.status)));
async function load(event?: CustomEvent) {
  error.value = ''; if (!canRead.value) { users.value = []; await event?.detail.complete(); return; }
  busy.value = true;
  try { users.value = await app.list(); } catch(e) { users.value = []; error.value = errorMessage(e); }
  finally { busy.value = false; await event?.detail.complete(); }
}
onIonViewWillEnter(() => { selected.value = null; success.value = ''; void load(); });
async function remove() {
  if (!selected.value || deleting.value) return;
  deleting.value = true; error.value = '';
  try { await app.delete({ id: selected.value.id }); success.value = 'Usuario eliminado correctamente.'; selected.value = null; await load(); }
  catch(e) { error.value = errorMessage(e); } finally { deleting.value = false; selected.value = null; }
}
const deleteButtons = [{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar usuario', role: 'destructive', handler: () => { void remove(); } }];
</script>
<template><IonPage><IonHeader><IonToolbar><IonTitle>{{ route.meta.mode === 'delete' ? 'Eliminar usuario' : route.meta.mode === 'edit' ? 'Editar usuario' : 'Usuarios' }}</IonTitle></IonToolbar></IonHeader>
<IonContent><IonRefresher slot="fixed" @ionRefresh="load"><IonRefresherContent pulling-text="Desliza para actualizar" refreshing-text="Actualizando…"/></IonRefresher>
<main class="page-content">
<div class="heading-row"><div><p class="eyebrow">PERSONAS Y CONEXIONES</p><h1>Tu equipo.</h1></div><RouterLink to="/usuarios/crear" class="button primary">Crear usuario</RouterLink></div>
<p v-if="!canRead" class="notice" role="alert">Tu rol no permite consultar usuarios. Solicita acceso a un administrador.</p>
<template v-else>
<section class="panel filters">
<IonSearchbar v-model="search" aria-label="Buscar usuarios" placeholder="Nombre, correo o ID" :debounce="0"/>
<IonSelect v-model="status" label="Filtrar por estado" label-placement="stacked" interface="alert" fill="outline"><IonSelectOption value="">Todos los estados</IonSelectOption><IonSelectOption v-for="(label,key) in statusLabel" :key="key" :value="key">{{ label }}</IonSelectOption></IonSelect>
<button class="button secondary" :disabled="busy" @click="load()">Actualizar</button>
</section>
<p v-if="error" class="error" role="alert">{{ error }}<button class="button secondary" @click="load()">Reintentar</button></p>
<p v-if="success" class="success" role="status">{{ success }}</p>
<p v-if="busy" class="empty" role="status">Cargando tu equipo…</p>
<section v-else-if="!filtered.length" class="panel empty"><h2>{{ error ? 'No se pudo cargar el equipo' : 'No hay usuarios para mostrar' }}</h2><p>{{ search || status ? 'Prueba con otros filtros.' : 'Crea un usuario para comenzar.' }}</p></section>
<template v-else><p class="muted">{{ filtered.length }} personas en el directorio</p><div class="user-grid"><article v-for="user in filtered" :key="user.id" class="panel user-card" :data-user-id="user.id">
<div class="user-heading"><span class="avatar">{{ user.name.slice(0,2).toUpperCase() }}</span><div><h2>{{ user.name }}</h2><p class="muted break">{{ user.email }}</p></div></div>
<div class="badges"><span class="pill">{{ roleLabel[user.role] }}</span><span class="badge" :class="user.status.toLowerCase()">{{ statusLabel[user.status] }}</span></div>
<div class="card-actions"><RouterLink :to="`/usuarios/${encodeURIComponent(user.id)}/editar`" class="button secondary" :aria-label="`${admin ? 'Editar' : 'Ver'} ${user.name}`">{{ admin ? 'Editar' : 'Consultar' }}</RouterLink><button v-if="admin" class="button danger-outline" :disabled="deleting" :aria-label="`Eliminar ${user.name}`" @click="selected = user">Eliminar</button></div>
</article></div></template>
</template>
<IonAlert :is-open="!!selected" :header="`¿Eliminar a ${selected?.name}?`" message="Esta acción elimina al usuario de la organización y no se puede deshacer." :buttons="deleteButtons" @didDismiss="selected = null"/>
</main></IonContent></IonPage></template>
