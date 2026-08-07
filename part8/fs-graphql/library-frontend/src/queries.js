import { gql } from '@apollo/client'

const ALL_AUTHOR = gql`
query AllAuthors {
  allAuthors {
    name,
    born,
    bookCount,
    id
  }
}`

const ALL_BOOKS = gql`query AllBooks {
  allBooks {
    author,
    title,
    published,id
  }
}`

const ADD_BOOK = gql`mutation AddBook($title: String!, $author: String!, $genres: [String!]!, $published: Int) {
  addBook(title: $title, author: $author, genres: $genres, published: $published) {
    author
    genres
    id
    published
    title
  }
}`

const EDIT_AUTHOR = gql`mutation Mutation($name: String!, $setBornTo: Int) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    bookCount
    born
    id
    name
  }
}`
export { ALL_AUTHOR, ALL_BOOKS, ADD_BOOK, EDIT_AUTHOR }