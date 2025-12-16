import { Users, Cpu, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    icon: Users,
    title: 'Sales Agent',
    description: 'Extracts and summarizes RFP requirements including voltage, material, insulation, and compliance standards.'
  },
  {
    icon: Cpu,
    title: 'Technical Agent',
    description: 'Matches RFP specifications to our SKU catalog and recommends top products with match percentages.'
  },
  {
    icon: DollarSign,
    title: 'Pricing Agent',
    description: 'Generates detailed cost estimates including material, service, and testing costs for each recommendation.'
  }
];

export default function HowItWorks() {
  return (
    <Card className="bg-muted/30" data-testid="card-how-it-works">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">How It Works</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4" data-testid={`step-${index + 1}`}>
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <step.icon className="w-4 h-4 text-primary" />
                  <p className="font-medium">{step.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
