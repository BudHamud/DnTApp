import { Person, Stats } from '../types';

export function calculateOutcome(currentStats: Stats, person: Person, action: 'live' | 'death'): Stats {
    if (action === 'death') {
        return {
            ecology: currentStats.ecology + person.death_ecology,
            peace: currentStats.peace + person.death_peace,
            healthcare: currentStats.healthcare + person.death_healthcare,
            prosperity: currentStats.prosperity + person.death_prosperity,
        };
    } else {
        return {
            ecology: currentStats.ecology + person.spare_ecology,
            peace: currentStats.peace + person.spare_peace,
            healthcare: currentStats.healthcare + person.spare_healthcare,
            prosperity: currentStats.prosperity + person.spare_prosperity,
        };
    }
}
