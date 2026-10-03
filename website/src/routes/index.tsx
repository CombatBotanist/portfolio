import { createFileRoute } from '@tanstack/react-router';
import { PortfolioWindow } from '#/components/PortfolioWindow';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PortfolioWindow />;
}
