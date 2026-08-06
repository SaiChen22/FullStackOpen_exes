import Blog from './Blog'
import {screen,render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
test('shows blog details to unauthenticated users without action buttons', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: {
      id: 'creator-1',
      username: 'creator',
      name: 'Creator One'
    }
  }

  render(<Blog blog={blog} currentUser={null} />)

  const title = screen.getByText('Component testing is done with react-testing-library')
  const author = screen.getByText('John Doe')
  const url = screen.getByText('http://example.com')
  const likes = screen.getByText('likes 5')
  const likeButton = screen.queryByRole('button', {name: 'like'})
  const deleteButton = screen.queryByRole('button', {name: 'delete'})

  expect(title).toBeInTheDocument()
  expect(author).toBeInTheDocument()
  expect(url).toBeInTheDocument()
  expect(likes).toBeInTheDocument()
  expect(likeButton).not.toBeInTheDocument()
  expect(deleteButton).not.toBeInTheDocument()
})

test('shows only the like button to authenticated users who are not the creator', () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 5,
      user: {
        id: 'creator-1',
        username: 'creator',
        name: 'Creator One'
      }
    }
    const currentUser = {
      id: 'user-2',
      username: 'reader',
      name: 'Reader Two'
    }

    render(<Blog blog={blog} currentUser={currentUser} updateLike={vi.fn()} deleteBlog={vi.fn()} />)

    const likeButton = screen.getByRole('button', {name: 'like'})
    const deleteButton = screen.queryByRole('button', {name: 'delete'})

    expect(likeButton).toBeInTheDocument()
    expect(deleteButton).not.toBeInTheDocument()
  })

test('shows the delete button to the blog creator', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: {
      id: 'creator-1',
      username: 'creator',
      name: 'Creator One'
    }
  }
  const currentUser = {
    id: 'creator-1',
    username: 'creator',
    name: 'Creator One'
  }

  render(<Blog blog={blog} currentUser={currentUser} updateLike={vi.fn()} deleteBlog={vi.fn()} />)

  const likeButton = screen.getByRole('button', {name: 'like'})
  const deleteButton = screen.getByRole('button', {name: 'delete'})

  expect(likeButton).toBeInTheDocument()
  expect(deleteButton).toBeInTheDocument()
})

test('calls like handler twice when like button is clicked twice', async () => {
  const mockUpdateLike = vi.fn()
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: {
      id: 'creator-1',
      username: 'creator',
      name: 'Creator One'
    }
  }
  const currentUser = {
    id: 'user-2',
    username: 'reader',
    name: 'Reader Two'
  }
  const user = userEvent.setup()

  render(<Blog blog={blog} currentUser={currentUser} updateLike={mockUpdateLike} deleteBlog={vi.fn()} />)

  const likeButton = screen.getByRole('button', {name: 'like'})
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockUpdateLike).toHaveBeenCalledTimes(2)
})