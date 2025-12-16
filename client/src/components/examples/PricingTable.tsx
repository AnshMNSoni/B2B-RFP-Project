import PricingTable from '../PricingTable';

export default function PricingTableExample() {
  const items = [
    {
      sku: 'CAB-11KV-CU-XLPE',
      description: '11kV Copper XLPE insulated industrial cable',
      basePrice: 1200,
      quantity: 100,
      materialCost: 80000,
      serviceCost: 5000,
      testingCost: 2500,
      totalCost: 207500
    },
    {
      sku: 'CAB-11KV-CU-PVC',
      description: '11kV Copper PVC insulated cable',
      basePrice: 1000,
      quantity: 50,
      materialCost: 35000,
      serviceCost: 2500,
      testingCost: 1250,
      totalCost: 88750
    }
  ];

  return <PricingTable items={items} grandTotal={296250} />;
}
