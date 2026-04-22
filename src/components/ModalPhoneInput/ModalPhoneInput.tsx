import './ModalPhoneInput.css';

export interface PhoneEntry {
  number: string;
  isWhatsapp: boolean;
}

export interface ModalPhoneInputProps {
  phones: PhoneEntry[];
  onChange: (phones: PhoneEntry[]) => void;
  label?: string;
  addLabel?: string;
  placeholder?: string;
}

export function ModalPhoneInput({
  phones,
  onChange,
  label,
  addLabel = '+ Add phone',
  placeholder = '(xx) xxxxx-xxxx',
}: ModalPhoneInputProps) {
  function add() {
    onChange([...phones, { number: '', isWhatsapp: false }]);
  }

  function remove(i: number) {
    onChange(phones.filter((_, idx) => idx !== i));
  }

  function setNumber(i: number, value: string) {
    onChange(phones.map((p, idx) => idx === i ? { ...p, number: value } : p));
  }

  function setWhatsapp(i: number, value: boolean) {
    onChange(phones.map((p, idx) => idx === i ? { ...p, isWhatsapp: value } : p));
  }

  return (
    <div className="mph-root">
      {label && <div className="mph-label">{label}</div>}

      {phones.length > 0 && (
        <div className="mph-list">
          {phones.map((p, i) => (
            <div key={i} className="mph-row">
              <input
                className="mph-input"
                type="tel"
                placeholder={placeholder}
                value={p.number}
                onChange={e => setNumber(i, e.target.value)}
              />
              <label className={`mph-wa-toggle${p.isWhatsapp ? ' mph-wa-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={p.isWhatsapp}
                  onChange={e => setWhatsapp(i, e.target.checked)}
                />
                WA
              </label>
              <button
                type="button"
                className="mph-remove"
                onClick={() => remove(i)}
                aria-label="Remove phone"
              >
                −
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" className="mph-add" onClick={add}>
        {addLabel}
      </button>
    </div>
  );
}
