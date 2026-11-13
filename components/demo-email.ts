export function buildDemoEmail(details:Record<string,string>){
 const name=[details.first_name,details.last_name].filter(Boolean).join(' ');
 const subject=`UCXO demo request — ${details.company}`;
 const body=[
  'Hello UCXO team,','','I would like to arrange a demo of UCXO.','',
  `Name: ${name}`,`Work email: ${details.email}`,`Company: ${details.company}`,
  `Job title: ${details.job_title}`,`Company size: ${details.company_size}`,`Country: ${details.country}`,
  '', 'What I would like to achieve:',details.goals?.trim()||'I would like to discuss this during the demo.',
  '',`Thank you,`,name,
 ].join('\r\n');
 return {body,href:`mailto:info@ubossai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};
}
