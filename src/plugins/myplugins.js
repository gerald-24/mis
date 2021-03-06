import { mapState, mapMutations } from 'vuex'

const myPlugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                api: process.env.VUE_APP_URL,
            }),
            computed: {
                ...mapState([
                    'userInfo',
                    // 'sBlnDrawer',
                    // 'sIntDrawerNav',
                    // 'sStrSubNav'
                ])
            },
            methods: {
                ...mapMutations([
                    'CHANGE_userInfo',
                    // 'CHANGE_sBlnDrawer',
                    // 'CHANGE_sIntDrawerNav',
                    // 'CHANGE_sStrSubNav',
                ])
            }
        })
    }
}

export default myPlugins