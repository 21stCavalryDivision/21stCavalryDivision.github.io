(function () {
  'use strict';

  const formations = [
    {
      name: '1st Cavalry Brigade',
      companies: [
        { name: 'Patriots', units: [
          { name: 'Patriots Headquarters', value: 'Patriots' },
          { name: '1st Squad', value: 'Patriots - 1st Squad' },
          { name: '2nd Squad', value: 'Patriots - 2nd Squad' },
          { name: '3rd Squad', value: 'Patriots - 3rd Squad' }
        ]},
        { name: 'Hellhounds', units: [
          { name: 'Hellhounds Headquarters', value: 'Hellhounds' },
          { name: '1st Squad', value: 'Hellhounds - 1st Squad' },
          { name: '2nd Squad', value: 'Hellhounds - 2nd Squad' }
        ]},
        { name: 'Reapers', units: [
          { name: 'Reapers Headquarters', value: 'Reapers' },
          { name: '1st Squad', value: 'Reapers - 1st Squad' },
          { name: '2nd Squad', value: 'Reapers - 2nd Squad' }
        ]}
      ]
    },
    {
      name: 'Special Troops Battalion (STB)',
      companies: [
        { name: 'Sentinel Company', units: [
          { name: 'Sentinel Company Headquarters', value: 'Sentinel Company' },
          { name: 'Ghost Squad', value: 'Sentinel Company - Ghost Squad' },
          { name: 'Stalker Squad', value: 'Sentinel Company - Stalker Squad' },
          { name: 'Raven Squad', value: 'Sentinel Company - Raven Squad' },
          { name: 'Nomad Squad', value: 'Sentinel Company - Nomad Squad' }
        ]},
        { name: 'Guardian Company', units: [
          { name: 'Guardian Company Headquarters', value: 'Guardian Company' },
          { name: 'Medical Section', value: 'Guardian Company - Medical Section' },
          { name: 'Support Section', value: 'Guardian Company - Support Section' }
        ]}
      ]
    },
    {
      name: 'Aviation Brigade',
      companies: [
        { name: 'IronEagle Company', units: [
          { name: 'IronEagle Company Headquarters', value: 'IronEagle Company' },
          { name: 'IronEagle 1', value: 'IronEagle 1' },
          { name: 'IronEagle 2', value: 'IronEagle 2' }
        ]},
        { name: 'NightWing Company', units: [
          { name: 'NightWing Company Headquarters', value: 'NightWing Company' },
          { name: 'NightWing 1', value: 'NightWing 1' },
          { name: 'NightWing 2', value: 'NightWing 2' }
        ]}
      ]
    }
  ];

  const legacySections = [
    'Unassigned', 'Division HQ', 'Command Staff',
    '2nd Cavalry Brigade', 'Spartans', 'Titans', 'Raiders',
    'Combat Aviation Brigade', 'Roughnecks', 'Havoc', 'Wolverine'
  ];

  const sections = [...legacySections];
  formations.forEach(f => {
    sections.push(f.name);
    f.companies.forEach(c => {
      sections.push(c.name);
      c.units.forEach(u => sections.push(u.value));
    });
  });

  const billets = [
    'Unassigned',
    'Division Commander', 'Executive Officer', 'Command Sergeant Major',
    'Operations Officer', 'Personnel Officer', 'Training Officer', 'First Sergeant',
    'Company Commander', 'Company Executive Officer', 'Company First Sergeant',
    'Platoon Leader', 'Platoon Sergeant', 'Squad Leader', 'Team Leader',
    'Rifleman', 'Automatic Rifleman', 'Grenadier', 'Machine Gunner',
    'Anti-Tank Rifleman', 'Designated Marksman', 'Combat Medic',
    'Radio Telephone Operator', 'Forward Observer',
    'Aviation Detachment Commander', 'Pilot', 'Copilot', 'Crew Chief', 'Door Gunner',
    'Armor Section Leader', 'Vehicle Commander', 'Gunner', 'Driver', 'Crewman',
    'Recon Company Commander', 'Recon Section Leader', 'Scout', 'Sniper', 'Spotter',
    'Medical Section Leader', 'Training Section Leader', 'Instructor', 'Training NCO',
    'Recruitment Section Leader', 'Recruiter'
  ];

  function esc(v) {
    return String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }

  function options(values, selected) {
    const list = [...values];
    if (selected && !list.includes(selected)) list.unshift(selected);
    return list.map(v => `<option value="${esc(v)}" ${v === selected ? 'selected' : ''}>${esc(v)}</option>`).join('');
  }

  function sectionDetails(section) {
    const value = String(section || '').trim();
    if (!value) return null;
    for (const formation of formations) {
      if (formation.name === value) return { level: 'formation', formation };
      for (const company of formation.companies) {
        if (company.name === value) return { level: 'company', formation, company };
        for (const unit of company.units) {
          if (unit.value === value) return { level: 'unit', formation, company, unit };
        }
      }
    }
    return legacySections.includes(value) ? { level: 'legacy', value } : null;
  }

  window.DivisionOrganization = { formations, sections: [...new Set(sections)], billets, options, sectionDetails };
})();
