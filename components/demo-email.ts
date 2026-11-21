export function buildDemoEmail(details:Record<string,string>,t:(source:string)=>string=source=>source){
 const name=[details.first_name,details.last_name].filter(Boolean).join(' ');
 const subject=t('UCXO demo request — {company}').replace('{company}',details.company);
 const field=(label:string,value:string)=>t(label).replace('{value}',value);
 const body=[t('Hello UCXO team,'),'',t('I would like to arrange a demo of UCXO.'),'',field('Name: {value}',name),field('Work email: {value}',details.email),field('Company: {value}',details.company),field('Job title: {value}',details.job_title),field('Company size: {value}',details.company_size),field('Country: {value}',details.country),'',t('What I would like to achieve:'),details.goals?.trim()||t('I would like to discuss this during the demo.'),'',t('Thank you,'),name].join('\r\n');
 return {body,href:'mailto:info@ubossai.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)};
}
