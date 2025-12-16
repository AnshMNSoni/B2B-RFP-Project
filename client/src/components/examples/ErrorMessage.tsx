import { useState } from 'react';
import ErrorMessage from '../ErrorMessage';

export default function ErrorMessageExample() {
  const [visible, setVisible] = useState(true);

  if (!visible) return <p className="text-muted-foreground">Error dismissed</p>;

  return (
    <ErrorMessage
      message="Failed to connect to server. Make sure the API is running on port 5000."
      onDismiss={() => setVisible(false)}
    />
  );
}
