import ProcessingStatus from '../ProcessingStatus';

export default function ProcessingStatusExample() {
  const steps = [
    {
      id: 'sales',
      name: 'Sales Agent',
      description: 'Extracting and summarizing RFP requirements',
      status: 'completed' as const
    },
    {
      id: 'technical',
      name: 'Technical Agent',
      description: 'Matching specifications with SKU catalog',
      status: 'processing' as const
    },
    {
      id: 'pricing',
      name: 'Pricing Agent',
      description: 'Generating cost estimates',
      status: 'pending' as const
    }
  ];

  return <ProcessingStatus steps={steps} />;
}
