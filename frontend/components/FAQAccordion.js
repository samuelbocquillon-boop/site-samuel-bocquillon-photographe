'use client';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

export const FAQAccordion = ({ items, testid = 'faq-accordion' }) => (
  <Accordion.Root type="single" collapsible className="w-full" data-testid={testid}>
    {items.map((item, i) => (
      <Accordion.Item key={i} value={`item-${i}`} className="border-b border-charbon/10">
        <Accordion.Header>
          <Accordion.Trigger
            className="group flex w-full items-center justify-between gap-4 py-5 text-left font-sans font-semibold text-[14px] sm:text-[15px] text-charbon min-h-[44px]"
            data-testid={`${testid}-trigger-${i}`}
          >
            {item.q}
            <ChevronDown className="h-4 w-4 shrink-0 text-cognac transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <p className="pb-6 text-[15px] leading-[1.7] text-charbon/80 max-w-2xl">{item.a}</p>
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>
);
