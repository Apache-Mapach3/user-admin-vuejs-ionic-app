<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonInputPasswordToggle, IonSelect, IonSelectOption, onIonViewWillEnter, onIonViewWillLeave } from '@ionic/vue';
import { useApplication, errorMessage, roleLabel, statusLabel } from '../context';
import { USER_ROLES, USER_STATUSES, type UserRole, type UserStatus } from '../../../domain/constants/user';
const app = useApplication(); const route = useRoute(); const router = useRouter();
const register = computed(() => !!route.meta.register); const editing = computed(() => typeof route.params.id === 'string');
const id = ref(''); const name = ref(''); const email = ref(''); const password = ref(''); const role = ref<UserRole>('MEMBER'); const status = ref<UserStatus>('PENDING');
const busy = ref(false); const loading = ref(false); const error = ref(''); const success = ref(false); const loaded = ref(false);
const canEdit = computed(() => !editing.value || app.currentSession()?.role === 'ADMIN');
let revision = 0;
async function enter() {
  const current = ++revision;
  id.value = editing.value ? String(route.params.id) : crypto.randomUUID();
  name.value = ''; email.value = ''; password.value = ''; role.value = 'MEMBER'; status.value = 'PENDING';
  error.value = ''; success.value = false; loaded.value = !editing.value; loading.value = editing.value;
  if (!editing.value) return;
  try {
    const user = await app.get({ id: id.value });
    if (current !== revision) return;
    name.value = user.name; email.value = user.email; role.value = user.role; status.value = user.status; loaded.value = true;
  } catch(e) { if (current === revision) error.value = errorMessage(e); }
  finally { if (current === revision) loading.value = false; }
}
onIonViewWillEnter(enter);
onIonViewWillLeave(() => { revision++; password.value = ''; });
async function submit() {
  if (!canEdit.value || !loaded.value || busy.value) return;
  busy.value = true; error.value = '';
  try {
    if (editing.value) await app.update({ id: id.value, name: name.value, email: email.value, password: password.value || undefined, role: role.value, status: status.value });
    else await app.create({ id: id.value, name: name.value, email: email.value, password: password.value, role: register.value ? 'MEMBER' : role.value });
    password.value = ''; success.value = true;
  } catch(e) { error.value = errorMessage(e); } finally { busy.value = false; }
}
</script>
<template><IonPage><IonHeader><IonToolbar><IonButtons slot="start"><IonBackButton :default-href="register ? '/login' : '/usuarios'" text="Volver"/></IonButtons><IonTitle>{{ editing ? 'Editar usuario' : register ? 'Crear cuenta' : 'Crear usuario' }}</IonTitle></IonToolbar></IonHeader>
<IonContent><main class="page-content form-content">
<p class="eyebrow">{{ register ? 'EMPIEZA AQUÍ' : 'GESTIÓN DEL EQUIPO' }}</p><h1>{{ editing ? 'Información del usuario' : register ? 'Crea tu cuenta.' : 'Un nuevo integrante.' }}</h1>
<section v-if="success" class="panel success" role="status"><h2>{{ editing ? 'Usuario actualizado' : 'Usuario creado correctamente' }}</h2><p v-if="!editing">La cuenta está pendiente de activación. Un administrador debe cambiar su estado a Activo antes de que pueda iniciar sesión.</p><p v-else>Los cambios se guardaron correctamente.</p><button class="button primary" @click="router.push(register ? '/login' : '/usuarios')">{{ register ? 'Ir al inicio de sesión' : 'Ver usuarios' }}</button></section>
<section v-else class="panel">
<p v-if="error" class="error" role="alert">{{ error }}<button v-if="!loaded" class="button secondary" @click="enter">Reintentar</button></p>
<p v-if="loading" class="empty" role="status">Cargando información…</p>
<form v-else @submit.prevent="submit">
<fieldset :disabled="busy || !canEdit || !loaded">
<IonInput v-model="name" label="Nombre completo" label-placement="stacked" fill="outline" autocomplete="name" autocapitalize="words" enterkeyhint="next" :minlength="3" :disabled="busy || !canEdit || !loaded" required/>
<IonInput v-model="email" label="Correo electrónico" label-placement="stacked" fill="outline" type="email" inputmode="email" autocomplete="email" autocapitalize="off" :spellcheck="false" enterkeyhint="next" :disabled="busy || !canEdit || !loaded" required/>
<IonInput v-if="canEdit" v-model="password" :label="editing ? 'Nueva contraseña (opcional)' : 'Contraseña'" label-placement="stacked" fill="outline" type="password" autocomplete="new-password" :minlength="8" :required="!editing" :disabled="busy || !loaded"><IonInputPasswordToggle slot="end"/></IonInput>
<p v-if="canEdit" class="field-hint">{{ editing ? 'Déjala vacía para conservar la contraseña actual.' : 'Usa al menos 8 caracteres.' }}</p>
<IonSelect v-if="!register" v-model="role" label="Rol de acceso" label-placement="stacked" fill="outline" interface="alert" :disabled="busy || !canEdit || !loaded"><IonSelectOption v-for="r in USER_ROLES" :key="r" :value="r">{{ roleLabel[r] }}</IonSelectOption></IonSelect>
<IonSelect v-if="editing" v-model="status" label="Estado" label-placement="stacked" fill="outline" interface="alert" :disabled="busy || !canEdit || !loaded"><IonSelectOption v-for="s in USER_STATUSES" :key="s" :value="s">{{ statusLabel[s] }}</IonSelectOption></IonSelect>
<p v-if="!register" class="field-hint break">Identificador: {{ id }}</p>
<button v-if="canEdit" class="button primary full" :disabled="busy || !loaded">{{ busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear usuario' }}</button>
</fieldset>
<p v-if="!canEdit" class="notice" role="alert">Tu rol permite consultar este usuario. Solo un administrador puede modificarlo.</p>
<RouterLink :to="register ? '/login' : '/usuarios'" class="button secondary full">Cancelar</RouterLink>
</form></section>
<p v-if="!editing && !success" class="muted">Las cuentas nuevas quedan pendientes de activación por un administrador.</p>
</main></IonContent></IonPage></template>
