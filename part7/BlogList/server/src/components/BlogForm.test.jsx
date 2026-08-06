import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls event handler with right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const submitButton = screen.getByText('create')

  await user.type(inputs[0], 'Testing a form')
  await user.type(inputs[1], 'John Doe')
  await user.type(inputs[2], 'http://example.com')
  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing a form',
    author: 'John Doe',
    url: 'http://example.com'
  })
})