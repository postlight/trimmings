import * as features from './src/features'

console.log(Object.entries(features).map(([k, f]) => f.name).sort())
