<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, onIonViewWillEnter } from '@ionic/vue';
import { useApplication, errorMessage, roleLabel } from '../context';
import type { UserResponse } from '../../../application/dto/responses/user-responses';
const app = useApplication(); const users = ref<UserResponse[]>([]); const error = ref(''); const busy = ref(false);
const session = computed(() => app.currentSession()); const canRead = computed(() => ['ADMIN','REVIEWER'].includes(session.value?.role || ''));
async function load() { users.value = []; error.value = ''; if (!canRead.value) return; busy.value = true; try { users.value = await app.list(); } catch(e) { error.value = errorMessage(e); } finally { busy.value = false; } }
onIonViewWillEnter(load);
</script>
<template><IonPage><IonHeader><IonToolbar><IonTitle>Nexo</IonTitle></IonToolbar></IonHeader><IonContent>
<main class="page-content">
  <p class="eyebrow">TU ESPACIO, EN ORDEN</p><h1>Bienvenido a tu panel.</h1><p class="muted">Tu equipo siempre a mano.</p>
  <section class="welcome"><span class="pill">PERSONAS QUE CONECTAN</span><h2>Las personas son el centro.</h2><p>Un espacio simple para acompañar a tu equipo, estés donde estés.</p><RouterLink to="/usuarios" class="button mint">Explorar usuarios</RouterLink></section>
  <div v-if="error" class="error" role="alert">{{ error }}<button class="button secondary" @click="load">Reintentar</button></div>
  <section class="stats"><article class="panel"><small>Tu rol</small><strong>{{ roleLabel[session?.role || ''] }}</strong></article><article v-if="canRead" class="panel"><small>Personas del equipo</small><strong>{{ busy ? '…' : error ? '—' : users.length }}</strong></article></section>
  <h2>¿Qué quieres hacer hoy?</h2><div class="quick-links"><RouterLink to="/usuarios/crear" class="panel action"><strong>Crear usuario</strong><span>Dale un lugar a un nuevo integrante →</span></RouterLink><RouterLink to="/usuarios" class="panel action"><strong>Conoce a tu equipo</strong><span>Usuarios, roles y estados →</span></RouterLink></div>
  <p v-if="!canRead" class="notice">Tu rol de miembro no permite consultar el directorio. Puedes crear usuarios y consultar tu cuenta.</p>
</main></IonContent></IonPage></template>
