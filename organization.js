/* Shared personnel assignments, matching the 21st Cavalry Division Discord. */
(() => {
    'use strict';

    const billets = Object.freeze([
        'Unassigned', 'Division Commander', 'Executive Officer',
        'Command Sergeant Major', 'Rifleman', 'Automatic Rifleman',
        'Grenadier', 'Machine Gunner', 'Anti-Tank Rifleman',
        'Designated Marksman', 'Combat Medic'
    ]);

    const company = (name, names, type = 'Platoon') => ({
        name,
        units: names.map((callsign, index) => ({
            name: `${['1st', '2nd', '3rd'][index]} ${Array.isArray(type) ? type[index] : type} — ${callsign}`
        }))
    });
    const formations = [
        { name: '1st Cavalry Brigade', companies: [
            company('Patriots', ['Viper', 'Havoc', 'Raider']),
            company('Hellhounds', ['Cerberus', 'Anvil', 'Inferno']),
            company('Reapers', ['Outlaw', 'Banshee', 'Vandal'], ['Platoon', 'Platoon', 'Squad'])
        ] },
        { name: '2nd Cavalry Brigade', companies: [
            company('Spartans', ['Saber', 'Phalanx', 'Hoplite']),
            company('Titans', ['Atlas', 'Cronus', 'Hyperion']),
            company('Raiders', ['Marauder', 'Jackal', 'Renegade'])
        ] },
        { name: 'Combat Aviation Brigade', companies: [
            company('Roughnecks', ['Warhorse', 'Mustang', 'Bronco']),
            company('Havoc', ['Thunder', 'Tempest', 'Cyclone']),
            company('Wolverine', ['Talon', 'Raptor', 'Kestrel'])
        ] },
        { name: 'Special Troops Battalion (STB)', companies: [
            company('Sentinel Company', ['Ghost', 'Specter']),
            company('NightWing Company', ['Raven', 'Phantom'], 'Squad'),
            company('Guardian Company', ['Aegis', 'Valkyrie'], 'Squad')
        ] }
    ];

    // Keep existing company values; include the parent company in platoon values.
    const sections = ['Unassigned', 'Division Headquarters'];
    const sectionDetails = new Map();
    sectionDetails.set('Division Headquarters', { formation: 'Division Headquarters' });
    for (const formation of formations) {
        sections.push(formation.name);
        sectionDetails.set(formation.name, { formation: formation.name });
        for (const entry of formation.companies) {
            sections.push(entry.name);
            sectionDetails.set(entry.name, { formation: formation.name, company: entry.name });
            for (const unit of entry.units) {
                unit.value = `${entry.name} / ${unit.name}`;
                sections.push(unit.value);
                sectionDetails.set(unit.value, { formation: formation.name, company: entry.name, unit: unit.name });
                Object.freeze(unit);
            }
            Object.freeze(entry.units);
            Object.freeze(entry);
        }
        Object.freeze(formation.companies);
        Object.freeze(formation);
    }

    const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));

    function options(values, selected) {
        // Preserve a historical assignment visibly, without offering it for new assignments.
        const legacy = selected && !values.includes(selected)
            ? `<option value="${escape(selected)}" selected disabled>${escape(selected)} (previous assignment)</option>`
            : '';
        return legacy + values.map(value => `<option value="${escape(value)}"${value === selected ? ' selected' : ''}>${escape(value)}</option>`).join('');
    }

    window.DivisionOrganization = Object.freeze({
        billets, sections: Object.freeze(sections), formations: Object.freeze(formations), options,
        sectionDetails: value => sectionDetails.get(String(value ?? '').trim()) || null,
        operationOptions: selected => options(['All Personnel', ...sections.filter(value => value !== 'Unassigned')], selected)
    });
})();
