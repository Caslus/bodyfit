import { FaCalendar } from 'react-icons/fa'

export default function DateInput({
  label,
  labelText,
  required,
  register,
  value,
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
        <span>{<FaCalendar />}</span>
        <input
          type={'date'}
          required={required != null ? required : false}
          className="input input-bordered w-full"
          {...register(label, { required: required })}
          value={value}
        />
      </label>
    </div>
  )
}
