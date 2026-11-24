import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteLocationNormalized } from 'vue-router';
import type { UseCases } from '../../application/ports/in/use-cases';
const AuthView = () => import('./views/AuthView.vue');
const HomeView = () => import('./views/HomeView.vue');
const UsersView = () => import('./views/UsersView.vue');
const UserFormView = () => import('./views/UserFormView.vue');
const AccountView = () => import('./views/AccountView.vue');
export function createAppRouter(app: UseCases) {
  const router = createRouter({ history: createWebHistory(), routes: [
    { path: '/login', component: AuthView, meta: { public: true } },
    { path: '/registro', component: UserFormView, meta: { public: true, register: true } },
    { path: '/', component: HomeView },
    { path: '/cuenta', component: AccountView },
    { path: '/usuarios', component: UsersView },
    { path: '/usuarios/crear', component: UserFormView },
    { path: '/usuarios/editar', component: UsersView, meta: { mode: 'edit' } },
    { path: '/usuarios/eliminar', component: UsersView, meta: { mode: 'delete' } },
    { path: '/usuarios/:id/editar', component: UserFormView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ] });
  router.beforeEach((to: RouteLocationNormalized) => {
    if (!to.meta.public && !app.currentSession()) return { path: '/login', query: { redirect: to.fullPath } };
  });
  return router;
}
