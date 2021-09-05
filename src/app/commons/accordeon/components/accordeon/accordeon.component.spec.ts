import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { AccordeonModule } from '../../accordeon.module';
import { AccordeonComponent } from './accordeon.component';

const setup = async (content: string, isOpen: boolean) => {
  await render<AccordeonComponent>(
    `<app-accordeon [isOpen]="isOpen">${content}</app-accordeon>`,
    {
      componentProperties: {
        isOpen: isOpen,
      },
      excludeComponentDeclaration: true,
      imports: [AccordeonModule],
      providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
    }
  );
  const accordeonButton = screen.getByRole('button', { name: 'Open it' });

  return { accordeonButton };
};

describe('AccordeonComponent tests', () => {
  test('open by default', async () => {
    await setup('test', true);

    expect(screen.queryByText('test')).toBeInTheDocument();
  });

  test('close by default', async () => {
    await setup('test', false);

    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });

  test('opening and closing', async () => {
    const { accordeonButton } = await setup('test', false);

    expect(screen.queryByText('test')).not.toBeInTheDocument();
    userEvent.click(accordeonButton);
    expect(screen.queryByText('test')).toBeInTheDocument();
    userEvent.click(accordeonButton);
    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });
});
