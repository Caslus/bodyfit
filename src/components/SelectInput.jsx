export default function SelectInput({
  icon,
  label,
  labelText,
  pickerText,
  required,
  options,
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
        <span>{icon}</span>
        <select
          className="select text-base font-normal input input-bordered w-[calc(100%-3rem)]"
          required={required != null ? required : false}
          {...register(label, { required: required })}
          value={value}
        >
          <option disabled selected>
            {pickerText}
          </option>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
