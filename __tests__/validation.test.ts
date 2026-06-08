import { validateEmail, validatePassword, validateLoginForm, validateRegisterForm } from '../src/utils/validation';


describe('Registration validation (TC1)', () => {
  test('valid form returns no error', () => {
    const error = validateRegisterForm('user@york.ac.uk', 'pablo', 'Pass123!');
    expect(error).toBeNull();
  });

  test('invalid email is rejected', () => {
    expect(validateEmail('notanemail')).not.toBeNull();
  });

  test('short password is rejected', () => {
    expect(validatePassword('123')).not.toBeNull();
  });

  test('empty username is rejected', () => {
    const error = validateRegisterForm('user@york.ac.uk', '', 'Pass123!');
    expect(error).not.toBeNull();
  });
});


describe('Login validation (TC3)', () => {
  test('valid form returns no error', () => {
    expect(validateLoginForm('pablo', 'Pass123!')).toBeNull();
  });

  test('empty username returns an error', () => {
    expect(validateLoginForm('', 'Pass123!')).not.toBeNull();
  });

  test('empty password returns an error', () => {
    expect(validateLoginForm('pablo', '')).not.toBeNull();
  });
});
