import { FormComponent } from './form.component';
import { render, screen } from '@testing-library/angular';
import { setupServer } from 'msw/node';
import { FormModule } from '../../form.module';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

const server = setupServer(
  rest.post<Record<string, unknown>>('/api/form', (req, res, ctx) => {
    if (req.body.name === 'false') {
      return res(ctx.json(false));
    }
    if (req.body.name === 'error') {
      return res(ctx.status(404));
    }
    return res(ctx.json(true));
  })
);

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  server.events.removeAllListeners();
  server.resetHandlers();
});

const setup = async () => {
  await render(FormComponent, {
    imports: [FormModule],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
    excludeComponentDeclaration: true,
  });
  const nameInput = screen.getByRole('textbox', { name: 'Name' });
  const surnameInput = screen.getByRole('textbox', { name: 'Surname' });
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Save that' });

  return { nameInput, surnameInput, passwordInput, submitButton };
};

describe('FormComponents tests', () => {
  test('all fields should be required', async () => {
    const { nameInput, surnameInput, passwordInput } = await setup();

    userEvent.click(nameInput);
    userEvent.click(surnameInput);
    userEvent.click(passwordInput);
    userEvent.tab();

    expect(screen.queryAllByText('This field is required').length).toEqual(3);
    expect(nameInput).toBeInvalid();
    expect(surnameInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
  });

  test('all fields should have validation', async () => {
    const { nameInput, surnameInput, passwordInput, submitButton } =
      await setup();

    userEvent.type(nameInput, 'xx');
    userEvent.type(surnameInput, 'xxxxxxx');
    userEvent.type(passwordInput, 'x');
    userEvent.tab();

    expect(nameInput).toBeInvalid();
    expect(
      screen.queryByText(
        'This field is required to have at least a few characters'
      )
    ).toBeInTheDocument();

    expect(surnameInput).toBeInvalid();
    expect(screen.queryByText('Not too long?')).toBeInTheDocument();

    expect(passwordInput).toBeInvalid();
    expect(screen.queryByText('Enter nicer password')).toBeInTheDocument();

    userEvent.click(submitButton);
    expect(
      screen.queryByText('Make sure form is completed without errors')
    ).toBeInTheDocument();
  });

  test('submitting form succesfully', async () => {
    const { nameInput, surnameInput, passwordInput, submitButton } =
      await setup();

    userEvent.type(nameInput, 'xxx');
    userEvent.type(surnameInput, 'xxxxxx');
    userEvent.type(passwordInput, 'Zxcvvbmm123');

    server.events.on('request:start', (request) => {
      expect(request.body).toEqual({
        name: 'xxx',
        surname: 'xxxxxx',
        password: 'Zxcvvbmm123',
      });
    });

    userEvent.click(submitButton);
    expect(await screen.findByText('Saved succesfully')).toBeInTheDocument();
  });

  test('submitting form unsucesfully', async () => {
    const { nameInput, surnameInput, passwordInput, submitButton } =
      await setup();

    userEvent.type(nameInput, 'false');
    userEvent.type(surnameInput, 'xxxxxx');
    userEvent.type(passwordInput, 'Zxcvvbmm123');

    userEvent.click(submitButton);
    expect(
      await screen.findByText('Something is wrong with your form')
    ).toBeInTheDocument();
  });

  test('error while submitting form', async () => {
    const { nameInput, surnameInput, passwordInput, submitButton } =
      await setup();

    userEvent.type(nameInput, 'error');
    userEvent.type(surnameInput, 'xxxxxx');
    userEvent.type(passwordInput, 'Zxcvvbmm123');

    userEvent.click(submitButton);
    expect(
      await screen.findByText('Error while saving the form')
    ).toBeInTheDocument();
  });
});
