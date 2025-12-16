import RFPSummaryCard from '../RFPSummaryCard';

export default function RFPSummaryCardExample() {
  const summary = {
    title: 'Supply of Industrial Power Cables',
    dueDate: '2025-03-15',
    voltage: '11kV',
    material: 'Copper',
    insulation: 'XLPE',
    compliance: ['IS Compliant', 'Industrial Grade'],
    requirements: [
      'Copper conductor material',
      'XLPE insulation type',
      'Voltage rating: 11kV',
      'Industrial grade specifications'
    ]
  };

  return <RFPSummaryCard summary={summary} />;
}
