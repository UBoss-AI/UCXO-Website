const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const ts=require('typescript'),path=require('node:path'),registryModule={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync('i18n/registry.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText)(require('node:module').createRequire(path.resolve('i18n/registry.ts')),registryModule,registryModule.exports);const {localeHref,parseLocalePath,locales}=registryModule.exports;
const {translateMessage}=require('../i18n/translate.ts');
const {buildDemoEmail}=require('../components/demo-email.ts');
test('the exact 34 locales keep distinct Chinese variants and RTL directions',()=>{assert.deepEqual(locales.map(l=>l.code),'en es de fr pt it nl pl uk ru ro cs hu el sv da nb fi zh-Hans zh-Hant ja ko id ms vi th fil ar tr fa he sw ha am'.split(' '));assert.equal(new Set(locales.map(l=>l.code)).size,34);assert.ok(locales.some(l=>l.code==='zh-Hans'));assert.ok(locales.some(l=>l.code==='zh-Hant'));assert.deepEqual(locales.filter(l=>l.dir==='rtl').map(l=>l.code),['ar','fa','he']);});
test('equivalent routes preserve queries and anchors and never duplicate locale prefixes',()=>{assert.equal(localeHref('fr','/book-a-demo/?source=demo#top'),'/fr/book-a-demo/?source=demo#top');assert.equal(localeHref('en','/ar/how-it-works/?x=1#top'),'/how-it-works/?x=1#top');assert.equal(localeHref('fr','/fr/#platform'),'/fr/#platform');assert.equal(localeHref('fr','https://app.ubossai.com/login'),'https://app.ubossai.com/login');assert.equal(parseLocalePath('/zh-Hant/how-it-works/').locale,'zh-Hant');});
test('complete messages interpolate localized chapter names without changing numbers',()=>{const messages={'Chapter {0}: {1}':'Chapitre {0} : {1}','Define and plan':'Définir et planifier'};assert.equal(translateMessage(messages,'Chapter 2: Define and plan'),'Chapitre 2 : Définir et planifier');});
test('localized email payloads retain the exact user input and fixed recipient',()=>{const c=JSON.parse(fs.readFileSync('i18n/catalogues/fr.locale.json')),messages=Object.fromEntries(Object.values(c.entries).map(e=>[e.source,e.text])),details={first_name:'Zoë',last_name:'User',email:'zoe@example.test',company:'ACME & Co',job_title:'Founder',company_size:'1–50',country:'India',goals:'Keep my exact words.'};const mail=buildDemoEmail(details,s=>translateMessage(messages,s)),url=new URL(mail.href);assert.equal(url.pathname,'info@ubossai.com');assert.ok(url.searchParams.get('subject').includes(details.company));for(const value of Object.values(details))assert.ok(mail.body.includes(value));assert.ok(!/\{value\}|\{company\}/.test(mail.body));assert.ok(mail.body.startsWith('Bonjour'));});test('translated pages reject unknown English copy while preserving branded identifiers',()=>{assert.throws(()=>translateMessage({Hello:'Bonjour'},'Missing phrase',true),/Uncatalogued/);assert.equal(translateMessage({},'01 UDashview',true),'01 UDashview');});
test('localized templates may reorder arguments without changing their values',()=>{assert.equal(translateMessage({'Chapter {0}: {1}':'{1} — chapitre {0}','Define and plan':'Définir et planifier'},'Chapter 2: Define and plan',true),'Définir et planifier — chapitre 2');});

test('each locale has a complete explainer recording and contiguous caption timings', () => {
  const {chapters}=require('../components/story-data.ts');
  const localizedTiming=require('../components/localized-explainer-timing.json');
  assert.deepEqual(Object.keys(localizedTiming).sort(),locales.map(l=>l.code).filter(code=>code!=='en').sort());

  for (const [locale,timeline] of Object.entries(localizedTiming)) {
    const asset=path.join('public','narration','localized',locale+'.mp3');
    assert.ok(fs.statSync(asset).size>10000,locale);
    assert.equal(timeline.length,chapters.length,locale);
    let start=0;
    for (const [index,segment] of timeline.entries()) {
      const chapter=chapters[index];
      assert.ok(Math.abs(segment.start-start)<.001,locale);
      assert.deepEqual(segment.points.map(point=>point.storyAt),[...chapter.captions.map(cue=>cue.at),chapter.duration],locale);
      assert.ok(segment.points.every((point,i)=>i===0?point.at===0:point.at>segment.points[i-1].at),locale);
      assert.equal(segment.points.at(-1).at,segment.duration,locale);
      start+=segment.duration;
    }
  }
});

test('all localized homepage tours include the intro, announcements and all guided steps', () => {
  const {tourChapters}=require('../components/product-tour-data.ts');
  const tracks=require('../components/localized-tour-timing.json');
  assert.deepEqual(Object.keys(tracks).sort(),locales.map(l=>l.code).filter(code=>code!=='en').sort());

  for (const [locale,track] of Object.entries(tracks)) {
    assert.ok(fs.statSync(path.join('public','narration','localized','tour',locale+'.mp3')).size>10000,locale);
    assert.equal(track.intro.start,0,locale);
    assert.ok(track.intro.duration>0,locale);
    assert.deepEqual(track.announcements.map(cue=>cue.label),tourChapters.map(chapter=>chapter.label),locale);
    assert.equal(track.timeline.length,tourChapters.length,locale);
    let time=track.intro.duration;
    for (const [index,chapter] of track.timeline.entries()) {
      const announcement=track.announcements[index];
      assert.ok(Math.abs(announcement.start-time)<.001 && announcement.duration>0,locale);
      time+=announcement.duration;
      assert.ok(Math.abs(chapter.start-time)<.001,locale);
      assert.equal(chapter.steps.length,tourChapters[index].steps.length,locale);
      for (const step of chapter.steps) {
        assert.ok(Math.abs(step.start-time)<.001 && step.duration>0,locale);
        time+=step.duration;
      }
      assert.ok(Math.abs(chapter.start+chapter.duration-time)<.001,locale);
    }
    assert.ok(Math.abs(track.duration-time)<.001,locale);
  }
});
