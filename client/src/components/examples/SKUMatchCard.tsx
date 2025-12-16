import SKUMatchCard from '../SKUMatchCard';

export default function SKUMatchCardExample() {
  const match = {
    sku: 'CAB-11KV-CU-XLPE',
    description: '11kV Copper XLPE insulated industrial cable',
    matchPercentage: 100,
    voltage: '11kV',
    material: 'Copper',
    insulation: 'XLPE',
    basePrice: 1200
  };

  return <SKUMatchCard match={match} rank={1} />;
}
