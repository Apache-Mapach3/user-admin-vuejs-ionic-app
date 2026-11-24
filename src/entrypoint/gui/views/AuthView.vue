<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonPage, IonContent, IonInput, IonInputPasswordToggle, onIonViewWillEnter } from '@ionic/vue';
import { Hexagon } from 'lucide-vue-next';
import { useApplication, errorMessage } from '../context';
const app = useApplication(); const router = useRouter(); const route = useRoute();
const email = ref(''); const password = ref(''); const busy = ref(false); const error = ref('');
onIonViewWillEnter(() => { password.value = ''; error.value = ''; });
async function submit() {
  if (busy.value) return;
  busy.value = true; error.value = '';
  try {
    await app.login({ email: email.value, password: password.value });
    password.value = ''; window.dispatchEvent(new Event('session-changed'));
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') && !route.query.redirect.startsWith('//') && !['/login','/registro'].includes(route.query.redirect) ? route.query.redirect : '/';
    await router.replace(redirect);
  } catch (e) { error.value = errorMessage(e); } finally { busy.value = false; }
}
</script>
<template><IonPage><IonContent class="auth-content">
  <main class="auth-card">
    <div class="brand"><Hexagon :size="32"/> nexo<span>.</span></div>
    <p class="eyebrow">TU EQUIPO, MÁS CERCA</p><h1>Qué bueno verte de nuevo.</h1>
    <p class="muted">Inicia sesión en tu espacio de trabajo.</p>
    <p v-if="route.query.expired" class="notice" role="alert">Tu sesión venció. Inicia sesión nuevamente.</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <form @submit.prevent="submit">
      <IonInput v-model="email" label="Correo electrónico" label-placement="stacked" fill="outline" type="email" inputmode="email" autocomplete="username" autocapitalize="off" :spellcheck="false" enterkeyhint="next" required />
      <IonInput v-model="password" label="Contraseña" label-placement="stacked" fill="outline" type="password" autocomplete="current-password" enterkeyhint="go" required><IonInputPasswordToggle slot="end"/></IonInput>
      <button class="button primary full" :disabled="busy">{{ busy ? 'Iniciando sesión…' : 'Iniciar sesión' }}</button>
    </form>
    <RouterLink to="/registro" class="text-link">Crear una cuenta</RouterLink>
    <p class="security">Tu equipo conectado, en cualquier lugar.</p>
  </main>
</IonContent></IonPage></template>
