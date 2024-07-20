import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(
        import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        component: () =>
            import('../components/Layout.vue'),
        children: [{
            path: '',
            component: () =>
                import('../views/Home.vue')
        }]
    },
    {
        path: '/map',
        component: () =>
            import('../components/Layout.vue'),
        children: [{
            path: '',
            component: () =>
                import('../views/Map.vue')
        }]
    },
    ]
})

export default router