import useNotificationStore from "../stores/notificationStore"
const Notification = () => {
  const message = useNotificationStore((state) => state.message)
  const type = useNotificationStore((state) => state.type)

  if (message === null) {
    return null
  }
  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification