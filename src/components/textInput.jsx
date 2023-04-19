function SpanRender({ icon, spanText }) {
  if (icon != null) {
    return <span>{icon}</span>
  } else if (spanText != null) {
    return <span>{spanText}</span>
  }
  return null
}

export default function TextInput({
  icon,
  spanText,
  placeholder,
  type,
  required,
  labelText,
  label,
  register,
}) {
  return (
    <div className="form-control">
      <label className="label">
        {labelText != null ? (
          <span className="label-text">
            {labelText}
            {required != null && required == true ? (
              <span className="label-text-alt text-primary">*</span>
            ) : (
              ''
            )}
          </span>
        ) : (
          ''
        )}
      </label>
      <label className="input-group">
        <SpanRender icon={icon} spanText={spanText} />
        <input
          type={type != null ? type : 'text'}
          placeholder={placeholder != null ? placeholder : ''}
          required={required != null ? required : false}
          className="input input-bordered w-full"
          {...register(label, { required: required })}
        />
      </label>
    </div>
  )
}
