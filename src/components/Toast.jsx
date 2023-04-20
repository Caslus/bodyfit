export default ({ icon, message, color }) => {
  return (
    <div className="toast">
      <div className={`alert ${color}`}>
        <div>
          {icon}
          {message}
        </div>
      </div>
    </div>
  )
}
