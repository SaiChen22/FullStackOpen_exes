export const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <div className={`notification ${notification.type ?? 'success'}`}>
      {notification.message}
    </div>
  )
}