import type {NextConfig} from 'next';
const config:NextConfig={images:{unoptimized:true},trailingSlash:true,outputFileTracingIncludes:{'/*':['./i18n/catalogues/*.json']}};
export default config;