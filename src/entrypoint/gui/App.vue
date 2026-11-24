<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { House, Users, CircleUserRound } from 'lucide-vue-next';
const route = useRoute(); const scope = ref(0);
function reset() { scope.value++; }
window.addEventListener('session-changed', reset);
onUnmounted(() => window.removeEventListener('session-changed', reset));
const publicPage = computed(() => !!route.meta.public);
</script>
<template>
  <IonApp>
    <IonRouterOutlet :key="scope" :class="{ 'with-tabs': !publicPage }" />
    <nav v-if="!publicPage" class="tabbar" aria-label="Navegación principal">
      <RouterLink to="/" :aria-current="route.path === '/' ? 'page' : undefined"><House :size="22"/><span>Inicio</span></RouterLink>
      <RouterLink to="/usuarios" :aria-current="route.path.startsWith('/usuarios') ? 'page' : undefined"><Users :size="22"/><span>Usuarios</span></RouterLink>
      <RouterLink to="/cuenta" :aria-current="route.path === '/cuenta' ? 'page' : undefined"><CircleUserRound :size="22"/><span>Mi cuenta</span></RouterLink>
    </nav>
  </IonApp>
</template>
