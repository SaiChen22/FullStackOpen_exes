export const Filter = ({ searchTerm, handleSearch }) => {
  return (
    <div>
      <p> filter shown with: </p>
      <input value={searchTerm}  placeholder="Search..." onChange={handleSearch} />
      
    </div>
  )
}