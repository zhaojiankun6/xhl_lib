import { inject, ref,computed,unref } from "vue";
import { injectlocalKey } from "./symbol";
import {get} from 'loadsh';
import LocalLangConfig from '@/local/index.js'
export const useLocalLang = (localeOverrides) => {
console.log(inject(injectlocalKey,ref()),'ddd');
    const locale = localeOverrides || inject(injectlocalKey,ref())
    return buildLocaleContext(computed(() => locale.value || 'zh'))
}

export const buildLocaleContext = (
    locale
  ) => {
    // const lang = computed(() => unref(locale).name)
    // const localeRef = isRef(locale) ? locale : ref(locale)
    return {
    //   lang,
    //   locale: localeRef,
      F: buildTranslator(locale),
    }
}
export const buildTranslator =(locale) =>{
    return (path, option) => translate(path, option, unref(locale));
}
 

export const translate = (
    path,
    option,
    locale
  ) => {
    path = `${locale}.${path}`
    // console.log(locale,path,option,LocalLangConfig);
    return (get(LocalLangConfig, path, '没有获取到')).replace(
        /\{(\w+)\}/g,
        (_, key) => `${(option&&option[key]) || `{${key}}`}`
      )
  } 
  