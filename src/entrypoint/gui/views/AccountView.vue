<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { useApplication, roleLabel } from '../context';
const app = useApplication(); const router = useRouter(); const session = app.currentSession();
function logout() { app.logout(); window.dispatchEvent(new Event('session-changed')); void router.replace('/login'); }
const links = [{ to:'/',label:'Inicio' },{ to:'/usuarios/crear',label:'Crear usuario' },{ to:'/usuarios',label:'Listar usuarios' },{ to:'/usuarios/editar',label:'Editar usuario' },{ to:'/usuarios/eliminar',label:'Eliminar usuario' }];
</script>
<template><IonPage><IonHeader><IonToolbar><IonTitle>Mi cuenta</IonTitle></IonToolbar></IonHeader><IonContent><main class="page-content">
<p class="eyebrow">TU ESPACIO PERSONAL</p><h1>Mi cuenta</h1><section class="panel"><h2>{{ roleLabel[session?.role || ''] }}</h2><p class="muted break">{{ session?.userId }}</p><p>Tu acceso al equipo Nexo.</p></section>
<nav class="account-links" aria-label="Acciones de cuenta"><RouterLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }} <span>→</span></RouterLink></nav>
<button class="button danger full" @click="logout">Cerrar sesión</button>
</main></IonContent></IonPage></template>
