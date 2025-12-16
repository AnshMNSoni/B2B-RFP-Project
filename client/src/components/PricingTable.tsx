import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PricingItem {
  sku: string;
  description: string;
  basePrice: number;
  quantity: number;
  materialCost: number;
  serviceCost: number;
  testingCost: number;
  totalCost: number;
}

interface PricingTableProps {
  items: PricingItem[];
  grandTotal: number;
}

export default function PricingTable({ items, grandTotal }: PricingTableProps) {
  return (
    <Card data-testid="card-pricing-table">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="w-5 h-5 text-primary" />
          Pricing Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="text-right font-semibold">Qty</TableHead>
                <TableHead className="text-right font-semibold">Base</TableHead>
                <TableHead className="text-right font-semibold">Material</TableHead>
                <TableHead className="text-right font-semibold">Service</TableHead>
                <TableHead className="text-right font-semibold">Testing</TableHead>
                <TableHead className="text-right font-semibold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.sku} data-testid={`row-pricing-${index}`}>
                  <TableCell className="font-mono font-medium">{item.sku}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-right font-mono">{item.quantity}</TableCell>
                  <TableCell className="text-right font-mono">${item.basePrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${item.materialCost.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${item.serviceCost.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${item.testingCost.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    ${item.totalCost.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className="text-lg font-semibold">Grand Total</span>
          <span className="text-2xl font-bold font-mono text-primary" data-testid="text-grand-total">
            ${grandTotal.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
