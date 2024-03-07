import {injectlocalKey} from '@/hooks/symbol.js';

const install = (app,lang) => {
    app.provide(injectlocalKey,  lang || 'zh')

}

export default {install}
