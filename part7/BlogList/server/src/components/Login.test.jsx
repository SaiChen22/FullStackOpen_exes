import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Login from './Login'

describe('Login', () => {
  test('calls handleLogin with the entered credentials', async () => {
    const user = userEvent.setup()
    const handleLogin = vi.fn()

    render(
      <Login
        notification={{ message: null, type: null }}
        handleLogin={handleLogin}
      />
    )

    await user.type(screen.getByLabelText('username'), 'mluukkai')
    await user.type(screen.getByLabelText('password'), 'salainen')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(handleLogin).toHaveBeenCalledWith({
      username: 'mluukkai',
      password: 'salainen',
    })
  })
})
